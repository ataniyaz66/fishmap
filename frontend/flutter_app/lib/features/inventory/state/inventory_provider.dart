import 'package:flutter/material.dart';
import '../../../core/config/api_config.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exceptions.dart';
import '../models/inventory_item.dart';

class InventoryProvider extends ChangeNotifier {
  final ApiClient apiClient;

  List<InventoryItem> _items = [];
  bool _isLoading = false;
  String? _errorMessage;
  String _categoryFilter = 'all';

  InventoryProvider({required this.apiClient});

  List<InventoryItem> get items {
    if (_categoryFilter == 'all') return _items;
    return _items
        .where((i) => i.category.toLowerCase() == _categoryFilter.toLowerCase())
        .toList();
  }

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String get categoryFilter => _categoryFilter;

  void setCategoryFilter(String category) {
    _categoryFilter = category;
    notifyListeners();
  }

  Future<void> fetchItems() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await apiClient.get(ApiConfig.inventoryItems);

      final dynamic rawList = res is Map<String, dynamic>
          ? (res['data'] ?? res['items'])
          : res;

      if (rawList is List) {
        _items = rawList
            .map((item) => InventoryItem.fromJson(item as Map<String, dynamic>))
            .toList();
      } else {
        _items = [];
      }
    } on ApiException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addItem({
    required String name,
    required String category,
    String? brand,
    int quantity = 1,
    String? color,
    double? weight,
    String visibility = 'private',
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final safeVisibility = ['private', 'friends'].contains(visibility)
          ? visibility
          : 'private';
      final body = <String, dynamic>{
        'name': name.trim(),
        'type': category.toLowerCase(),
        'category': category.toLowerCase(),
        'quantity': quantity,
        'visibility': safeVisibility,
      };
      if (brand != null && brand.isNotEmpty) body['brand'] = brand.trim();
      if (color != null && color.isNotEmpty) body['color'] = color.trim();
      if (weight != null) {
        body['weight_grams'] = weight;
        body['weightGrams'] = weight;
      }

      final res = await apiClient.post(ApiConfig.inventoryItems, body: body);

      InventoryItem? newItem;
      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : (res['item'] is Map<String, dynamic>
                  ? res['item'] as Map<String, dynamic>
                  : res);
        if (data['id'] != null) {
          newItem = InventoryItem.fromJson(data);
        }
      }

      if (newItem != null) {
        _items.insert(0, newItem);
      } else {
        await fetchItems();
      }

      _isLoading = false;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateQuantity(String id, int newQuantity) async {
    if (newQuantity < 0) return false;

    final index = _items.indexWhere((i) => i.id == id);
    if (index == -1) return false;

    final oldItem = _items[index];
    _items[index] = oldItem.copyWith(quantity: newQuantity);
    notifyListeners();

    try {
      await apiClient.patch(
        '${ApiConfig.inventoryItems}/$id',
        body: {'quantity': newQuantity},
      );
      return true;
    } catch (_) {
      // Revert on failure
      _items[index] = oldItem;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteItem(String id) async {
    final index = _items.indexWhere((i) => i.id == id);
    if (index == -1) return false;

    final removed = _items.removeAt(index);
    notifyListeners();

    try {
      await apiClient.delete('${ApiConfig.inventoryItems}/$id');
      return true;
    } catch (_) {
      // Revert
      _items.insert(index, removed);
      notifyListeners();
      return false;
    }
  }
}
