import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  Leaf,
  Store,
  BarChart3,
  PackageSearch,
  Menu,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PRIMARY_COLOR = '#2ecc70';
const BG_LIGHT = '#f6f8f7';
const SLATE_900 = '#0f172a';
const SLATE_600 = '#475569';
const SLATE_500 = '#64748b';

const Navbar = () => (
  <SafeAreaView style={styles.navbarContainer}>
    <View style={styles.navbar}>
      <View style={styles.logoContainer}>
        <Leaf color={PRIMARY_COLOR} size={28} />
        <Text style={styles.logoText}>SmartVegies</Text>
      </View>
      <TouchableOpacity>
        <Menu color={SLATE_900} size={28} />
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const Hero = () => (
  <View style={styles.heroSection}>
    <View style={styles.heroContent}>
      <Text style={styles.overline}>DIRECT FROM LOCAL FARMS</Text>

      <Text style={styles.heroTitle}>
        Freshness Delivered from{' '}
        <Text style={{ color: PRIMARY_COLOR }}>Local Fields</Text> to Your Table
      </Text>

      <Text style={styles.heroDescription}>
        Connecting you with passionate local vendors for the highest quality produce in your neighborhood.
      </Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Shop Fresh Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Start Selling</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialProof}>
        <View style={styles.avatarStack}>
          <View style={[styles.avatar, { backgroundColor: '#d1fae5', zIndex: 3 }]} />
          <View style={[styles.avatar, { backgroundColor: '#a7f3d0', zIndex: 2, marginLeft: -10 }]} />
          <View style={[styles.avatar, { backgroundColor: '#6ee7b7', zIndex: 1, marginLeft: -10 }]} />
        </View>

        <Text style={styles.socialProofText}>Joined by 2,000+ local foodies</Text>
      </View>
    </View>

    <Image
      source={{
        uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBicm-SOYkeuB0QkTYSgoJ3hyuaZzQDQ6SWhg9vwfeOPfRJb3CCdmOHCzzx7uzIauShVp3WYs_iaV43i6PocPT8X4shoIIRJQaq5TgKtrjrBZ1ngfdAPUD9Ae44LgTwozUyZvDNY0NV5ptXqP2faheTyV-BTZaWMwbFO_Clvvaa9kXzYHSogsHIj7liFl3WnSeA8kodbkarLLENL8yKlFCbCUA7nwpowKtMgDVqPXQjTODKil0HUs96U235g3Dz-F9NEtLxZAXRhRs'
      }}
      style={styles.heroImage}
      resizeMode="cover"
    />
  </View>
);

const FeatureCard = ({ number, title, description, image }) => (
  <View style={styles.featureCard}>
    <Image source={{ uri: image }} style={styles.featureImage} />

    <View style={styles.featureContent}>
      <View style={styles.featureHeader}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{number}</Text>
        </View>

        <Text style={styles.featureTitle}>{title}</Text>
      </View>

      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const VendorTool = ({ icon: Icon, title, description }) => (
  <View style={styles.vendorToolCard}>
    <View style={styles.iconContainer}>
      <Icon color={PRIMARY_COLOR} size={24} />
    </View>

    <Text style={styles.vendorToolTitle}>{title}</Text>
    <Text style={styles.vendorToolDescription}>{description}</Text>
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },

  navbarContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: SLATE_900,
    marginLeft: 8,
  },

  heroSection: {
    padding: 20,
    paddingTop: 40,
  },

  heroContent: {
    marginBottom: 30,
  },

  overline: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: SLATE_900,
    lineHeight: 42,
    marginBottom: 15,
  },

  heroDescription: {
    fontSize: 16,
    color: SLATE_600,
    lineHeight: 24,
    marginBottom: 25,
  },

  buttonGroup: {
    marginBottom: 10,
  },

  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },

  secondaryButton: {
    backgroundColor: 'white',
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: SLATE_900,
    fontSize: 18,
    fontWeight: '700',
  },

  heroImage: {
    width: '100%',
    height: 250,
    borderRadius: 24,
    marginTop: 20,
  },

  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },

  avatarStack: {
    flexDirection: 'row',
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
  },

  socialProofText: {
    fontSize: 14,
    color: SLATE_500,
    marginLeft: 10,
  },

  sectionWhite: {
    backgroundColor: 'white',
    padding: 20,
    paddingVertical: 60,
  },

  sectionGray: {
    padding: 20,
    paddingVertical: 60,
  },

  sectionOverline: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: SLATE_900,
    marginBottom: 12,
  },

  sectionDescription: {
    fontSize: 16,
    color: SLATE_600,
    marginBottom: 30,
  },

  featureCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 20,
    overflow: 'hidden',
  },

  featureImage: {
    width: '100%',
    height: 180,
  },

  featureContent: {
    padding: 20,
  },

  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  numberText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },

  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: SLATE_900,
  },

  featureDescription: {
    fontSize: 14,
    color: SLATE_600,
    lineHeight: 20,
  },

  vendorToolCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  vendorToolTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: SLATE_900,
    marginBottom: 8,
  },

  vendorToolDescription: {
    fontSize: 14,
    color: SLATE_600,
    lineHeight: 20,
  },

  ctaContainer: {
    padding: 20,
    paddingVertical: 40,
  },

  ctaCard: {
    backgroundColor: SLATE_900,
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
  },

  ctaTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    marginBottom: 25,
  },

  ctaButton: {
    backgroundColor: PRIMARY_COLOR,
    width: '100%',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    padding: 40,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: SLATE_900,
  },

  footerSubtext: {
    fontSize: 12,
    color: SLATE_500,
    marginTop: 4,
  },
});
export default function Home() {
  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Hero />

        {/* Buyers */}
        <View style={styles.sectionWhite}>
          <Text style={styles.sectionOverline}>FOR BUYERS</Text>
          <Text style={styles.sectionTitle}>Simple, Fast & Always Fresh</Text>

          <Text style={styles.sectionDescription}>
            Get the best seasonal produce delivered to your door in three easy steps.
          </Text>

          <FeatureCard
            number={1}
            title="Browse Vendors"
            description="Discover highly-rated local farmers and artisans in your immediate area."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCEYy2RNzEtXZk0lNKIWlQFCSiM9s_fy0J9HeOuLhAeVsBQcHJSEtSoI5ukL7mfZHY-fCoEFf9fco9L3wlp8USfSM8aA4IYkHOiKo8yPiqietXrUO-9s7hzRBfb51RAw5qltg06smkdUJtJa1_8b92uocZI4v-4jL_HyCRu_OcLhOd-wjmUuyh0hqqy2Xmu9Ev4aYrNHSw9VQAIFxx2nm6pYZZpnVDjBzUmRdV2uY-xqiwzkoSUI9u7g3mjBBo1PfszA9BpG8RsFiHS"
          />

          <FeatureCard
            number={2}
            title="Place Order"
            description="Select your favorites, customize your basket, and pay securely online."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuAb1JvAgI73QBrQgmaRkjbFZUYHlV20qPKowLRQNM1Sp3Gmv4EsjV4YXJorc9r_-aK3a2jI3n6xjeYpf15XfceiuBkdP2mINvrsodliGbzmJeWLMjgA0COl1DTOBgvANccVxoAMyZXEyfXL5ZPCOxaqdC2p6iMj9nRVo3GPCGXINo9XCp4J81zqJgiTLRHolqZ9yowceTQo8QAK78nbwXpLyoquz9pibeQHMc3xwGhQq4RIpa_m4jtofx9dTSGDmPA1S9QkTZI9TAoX"
          />

          <FeatureCard
            number={3}
            title="Fresh Delivery"
            description="Receive farm-fresh produce at your doorstep within 24 hours of harvest."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuB8K9qQHjAvH1lKl-MdPafW3qyAUvqt5QHotpczi1ZdF8AB-SM0eVFata6Vo9c1x-NYCixBBTPoFy7S7EUGzvxnZH17xDmkYQsIeYVrT66zR8fyTMSTD-tTVk6-IcuM6YWgOsDjEipm1R1VI92HPh4rOM3pwf2pfdWcRU016Cd2PvZVUq9vsxSbWVqrSy74wsKlrXuTLhp-qraGvk4DOAUa1QN7L4m1MbS3iP_xpmFZIBr3U8ZMsrjzTZq5nrs_6zhMIuCQoEiQc2CA"
          />
        </View>

        {/* Vendors */}
        <View style={styles.sectionGray}>
          <Text style={[styles.sectionOverline, { textAlign: 'center' }]}>FOR VENDORS</Text>
          <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>Empower Your Farm</Text>

          <VendorTool
            icon={Store}
            title="Easy Setup"
            description="Launch your digital stall in minutes. Upload photos and start listing products."
          />

          <VendorTool
            icon={PackageSearch}
            title="Smart Inventory"
            description="Real-time stock management. Update availability instantly."
          />

          <VendorTool
            icon={BarChart3}
            title="Growth Insights"
            description="Understand your customers better with detailed sales analytics."
          />

          <TouchableOpacity style={[styles.primaryButton, { marginTop: 20 }]}>
            <Text style={styles.primaryButtonText}>Apply to Sell</Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>
              Ready to join the <Text style={{ color: PRIMARY_COLOR }}>local food revolution</Text>?
            </Text>

            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.primaryButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 SmartVegies Inc.</Text>
          <Text style={styles.footerSubtext}>Locally sourced. Community driven.</Text>
        </View>
      </ScrollView>
    </View>
  
);
}
