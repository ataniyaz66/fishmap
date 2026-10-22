class InventoryItem {
  final String id;
  final String name;
  final String category;
  final String? brand;
  final int quantity;
  final String? color;
  final double? weight;
  final String visibility;
  final Map<String, dynamic>? specifications;
  final DateTime? createdAt;

  InventoryItem({
    required this.id,
    required this.name,
    this.category = 'lure',
    this.brand,
    this.quantity = 1,
    this.color,
    this.weight,
    this.visibility = 'public',
    this.specifications,
    this.createdAt,
  });

  factory InventoryItem.fromJson(Map<String, dynamic> json) {
    int qty = 1;
    if (json['quantity'] != null) {
      qty = int.tryParse(json['quantity'].toString()) ?? 1;
    }

    double? parsedWeight;
    if (json['weight'] != null) {
      parsedWeight = double.tryParse(json['weight'].toString());
    } else if (json['specifications'] is Map &&
        json['specifications']['weight'] != null) {
      parsedWeight = double.tryParse(
        json['specifications']['weight'].toString(),
      );
    }

    String? parsedColor = json['color']?.toString();
    if (parsedColor == null &&
        json['specifications'] is Map &&
        json['specifications']['color'] != null) {
      parsedColor = json['specifications']['color'].toString();
    }

    return InventoryItem(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Tackle Item',
      category: json['category']?.toString() ?? 'lure',
      brand: json['brand']?.toString(),
      quantity: qty,
      color: parsedColor,
      weight: parsedWeight,
      visibility: json['visibility']?.toString() ?? 'public',
      specifications: json['specifications'] is Map<String, dynamic>
          ? json['specifications'] as Map<String, dynamic>
          : null,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      if (brand != null) 'brand': brand,
      'quantity': quantity,
      if (color != null) 'color': color,
      if (weight != null) 'weight': weight,
      'visibility': visibility,
      if (specifications != null) 'specifications': specifications,
    };
  }

  InventoryItem copyWith({
    String? name,
    String? category,
    String? brand,
    int? quantity,
    String? color,
    double? weight,
    String? visibility,
  }) {
    return InventoryItem(
      id: id,
      name: name ?? this.name,
      category: category ?? this.category,
      brand: brand ?? this.brand,
      quantity: quantity ?? this.quantity,
      color: color ?? this.color,
      weight: weight ?? this.weight,
      visibility: visibility ?? this.visibility,
      specifications: specifications,
      createdAt: createdAt,
    );
  }
}
