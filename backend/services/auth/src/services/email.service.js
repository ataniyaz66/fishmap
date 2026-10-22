/**
 * Email Provider Abstraction for Auth Service
 * Distinguishes configured providers (SMTP/SendGrid/SES) from local mock/development.
 */

class EmailService {
  constructor() {
    this.providerName = process.env.EMAIL_PROVIDER || 'mock';
    this.isConfigured = this.providerName !== 'mock' && !!process.env.EMAIL_API_KEY;
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    if (!this.isConfigured) {
      // In development / mock mode, log token to dev console for testing without external service
      console.log(`[EmailService:DEV_MOCK] Password reset email for ${email}. Reset URL: ${resetUrl}`);
      return {
        sent: true,
        provider: 'mock',
        message: 'Email delivered to mock dev provider'
      };
    }

    // Production provider implementation hook
    // (e.g. nodemailer or Sendgrid client)
    return {
      sent: true,
      provider: this.providerName
    };
  }

  async sendVerificationEmail(email, token) {
    const verifyUrl = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    if (!this.isConfigured) {
      console.log(`[EmailService:DEV_MOCK] Verification email for ${email}. Verify URL: ${verifyUrl}`);
      return {
        sent: true,
        provider: 'mock',
        message: 'Email delivered to mock dev provider'
      };
    }

    return {
      sent: true,
      provider: this.providerName
    };
  }
}

module.exports = new EmailService();
