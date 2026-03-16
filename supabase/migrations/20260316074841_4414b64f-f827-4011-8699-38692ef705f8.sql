
CREATE TABLE public.site_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- Everyone can read published pages
CREATE POLICY "Published pages viewable by everyone" ON public.site_pages
  FOR SELECT USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage pages" ON public.site_pages
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_site_pages_updated_at
  BEFORE UPDATE ON public.site_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed default pages
INSERT INTO public.site_pages (slug, title, content) VALUES
  ('contact', 'Contact Us', '## Contact Us

Have questions? We''d love to hear from you.

**Email:** hello@sourcestack.dev
**Phone:** +1 (555) 123-4567
**Location:** San Francisco, CA

### Business Hours
Monday - Friday: 9:00 AM - 6:00 PM (PST)

Feel free to reach out for support, partnership inquiries, or general questions.'),
  ('faq', 'Frequently Asked Questions', '## FAQ

### What is SourceStack?
SourceStack is a premium digital marketplace where you can buy and sell code templates, UI kits, and other digital products.

### How do I become a vendor?
Sign up for an account and apply for vendor status. Once approved, you can start uploading and selling your products.

### What payment methods are accepted?
We support credit cards, debit cards, and various digital payment methods.

### Can I get a refund?
Yes, we offer refunds within 14 days of purchase if the product does not meet your expectations.

### How do I download my purchased products?
After purchase, go to your Library page to access all your downloads.'),
  ('privacy', 'Privacy Policy', '## Privacy Policy

**Last updated:** March 2026

### Information We Collect
We collect information you provide directly, such as your name, email address, and payment information when you create an account or make a purchase.

### How We Use Your Information
- To provide and maintain our service
- To process transactions
- To send important notifications
- To improve our platform

### Data Security
We implement industry-standard security measures to protect your personal information.

### Contact
If you have questions about this privacy policy, contact us at privacy@sourcestack.dev'),
  ('terms', 'Terms of Service', '## Terms of Service

**Last updated:** March 2026

### 1. Acceptance of Terms
By accessing SourceStack, you agree to be bound by these terms.

### 2. User Accounts
You are responsible for maintaining the confidentiality of your account credentials.

### 3. Products & Licensing
All digital products come with their specified license. Redistribution without permission is prohibited.

### 4. Vendor Terms
Vendors must ensure their products are original and do not infringe on third-party rights.

### 5. Refund Policy
Refunds may be requested within 14 days of purchase under our refund guidelines.

### 6. Limitation of Liability
SourceStack is not liable for any indirect or consequential damages.

### Contact
Questions? Email legal@sourcestack.dev');
