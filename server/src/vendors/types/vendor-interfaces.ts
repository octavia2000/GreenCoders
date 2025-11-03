// Interfaces for vendor-related data structures

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface BusinessHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface ShippingMethod {
  name: string;
  cost: number;
  duration: string;
  description?: string;
}

export interface ShippingZone {
  zone: string;
  cost: number;
  estimatedDays: string;
  countries?: string[];
}

export interface FreeShippingThreshold {
  enabled: boolean;
  minimumAmount: number;
  currency?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  accountType?: 'savings' | 'current' | 'business';
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
}

export interface VendorBusinessInfo {
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
  businessEmail?: string;
  businessPhoneNumber?: string;
  businessRegistrationNumber?: string;
  businessType?: 'sole_proprietor' | 'partnership' | 'llc' | 'corporation';
  businessDescription?: string;
  websiteUrl?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  yearsInBusiness?: number;
  socialMediaLinks?: SocialMediaLinks;
  businessHours?: BusinessHours;
}

export interface VendorShippingInfo {
  shippingMethods?: ShippingMethod[];
  shippingZones?: ShippingZone[];
  offersLocalPickup?: boolean;
  pickupAddress?: string;
  freeShippingThreshold?: FreeShippingThreshold;
  processingTime?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  returnWindowDays?: number;
  acceptsReturns?: boolean;
  returnConditions?: string[];
}

