import { createFreshAdminClient, getStoreId, isBuildTime } from "./supabase";
import { getStoreConfig } from "./store";

export interface StoreSettings {
  // Branding
  brandColor: string;
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroCtaLink: string;
  heroImage: string;
  // About section
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  showAbout: boolean;
  // Contact
  phoneNumber: string;
  address: string;
  businessHours: string;
  showContactForm: boolean;
  // Social
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  // SEO
  seoTitle: string;
  seoDescription: string;
}

function getDefaultSettings(): StoreSettings {
  const store = getStoreConfig();
  return {
    brandColor: store.brandColor || "#10b981",
    heroTitle: "Welcome to Our Site",
    heroSubtitle: "Showcasing our work and expertise",
    heroCta: "View Portfolio",
    heroCtaLink: "#portfolio",
    heroImage: "",
    aboutTitle: "About Us",
    aboutText: "We are passionate about what we do and committed to delivering excellence.",
    aboutImage: "",
    showAbout: true,
    phoneNumber: "",
    address: "",
    businessHours: "",
    showContactForm: true,
    socialLinks: {},
    seoTitle: "",
    seoDescription: "",
  };
}

/**
 * Get store settings from the database
 * Uses createFreshAdminClient() to avoid Supabase PostgREST caching issues
 * Uses .limit(1) instead of .single() for additional cache bypass
 */
export async function getStoreSettingsFromDB(): Promise<StoreSettings> {
  const defaults = getDefaultSettings();

  // During build time, return defaults to avoid errors
  if (isBuildTime()) {
    return defaults;
  }

  const supabase = createFreshAdminClient();
  const storeId = getStoreId();

  if (!supabase || !storeId) {
    return defaults;
  }

  try {
    // Use .limit(1) instead of .single() to bypass PostgREST caching
    const { data: rows } = await supabase
      .from("store_settings")
      .select("settings")
      .eq("store_id", storeId)
      .limit(1);

    const data = rows?.[0];

    if (data?.settings) {
      return { ...defaults, ...data.settings };
    }
  } catch {
    // Settings table might not exist yet
  }

  return defaults;
}

/**
 * Update store settings in the database
 * Uses createFreshAdminClient() to ensure write goes through without caching issues
 */
export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<boolean> {
  if (isBuildTime()) {
    return false;
  }

  const supabase = createFreshAdminClient();
  const storeId = getStoreId();

  if (!supabase || !storeId) return false;

  try {
    const { error } = await supabase
      .from("store_settings")
      .upsert({
        store_id: storeId,
        settings,
        updated_at: new Date().toISOString(),
      }, { onConflict: "store_id" });

    return !error;
  } catch {
    return false;
  }
}
