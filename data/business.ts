/**
 * Central business / company details.
 *
 * TODO (client): replace every placeholder below with your real, registered
 * business information before going live. These values are surfaced in the
 * footer, the Business Info section, and legal pages.
 */
export const business = {
  // TODO: registered legal/company name
  legalName: "Aurum Bullion Ltd.",
  tradingName: "Aurum",
  // TODO: company registration / incorporation number
  registrationNumber: "REG-XXXXXXXX",
  // TODO: precious-metals dealer license / permit number
  licenseNumber: "LIC-XXXXXXXX",
  // TODO: tax / VAT identification number
  taxId: "TAX-XXXXXXXX",

  // TODO: registered physical address
  address: {
    line1: "123 Bullion House, Example Street",
    line2: "Suite 100",
    city: "Accra",
    region: "Greater Accra",
    postalCode: "00233",
    country: "Ghana",
  },

  // TODO: real contact details
  email: "sales@aurumbullion.example",
  supportEmail: "support@aurumbullion.example",
  complianceEmail: "compliance@aurumbullion.example",
  phone: "+233 (0)20 000 0000",
  // International format, digits only — also used for WhatsApp deep links.
  whatsapp: "233200000000",

  // TODO: business hours in your timezone
  hours: "Mon–Fri, 9:00–17:00 GMT",

  // TODO: licensing / regulatory authority the business is registered with
  regulator: "Registered precious-metals dealer (authority name TBD)",
} as const;
