import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Leaf, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Store, 
  Eye, 
  EyeOff 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const isDesktop = Platform.OS === 'web' && width > 900;

// ─── Social Icons (Simple placeholders to avoid SVG errors) ─────────────────────────────

const GoogleIcon = () => (
  <View style={{ width: 20, height: 20, backgroundColor: '#EA4335', borderRadius: 10 }} />
);

const FacebookIcon = () => (
  <View style={{ width: 20, height: 20, backgroundColor: '#1877F2', borderRadius: 10 }} />
);

// ─── Reusable Components ──────────────────────────────────────────────────────

const Field = ({ label, error, children }: any) => (
  <View style={styles.field}>
    {typeof label === 'string' ? <Text style={styles.label}>{label}</Text> : label}
    {children}
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const Input = ({ icon: Icon, rightSlot, error, ...props }: any) => (
  <View style={[styles.inputBox, error && styles.inputBoxError]}>
    {Icon && <Icon size={20} color="#6b7280" />}
    <TextInput 
      style={styles.input} 
      placeholderTextColor="#9ca3af"
      {...props} 
    />
    {rightSlot}
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LoginRegister() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("buyer");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    name: "", email: "", phone: "", password: "",
    confirmPassword: "", farmName: "", location: "",
    remember: false, agree: false,
  });

  const router = useRouter();

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
  };

  const set = (name, value) => {
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e: any = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Full name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address.";
    if (form.password.length < 8) e.password = "Minimum 8 characters.";
    if (mode === "signup" && form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (mode === "signup" && role === "vendor" && !form.farmName.trim()) e.farmName = "Farm name is required.";
    if (mode === "signup" && !form.agree) e.agree = "You must agree to continue.";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      
      let payload;
      if (mode === "login") {
        payload = { email: form.email, password: form.password, role };
      } else {
        payload = { ...form, role };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Authentication failed");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("role", data.role);
      setSubmitted(true);

      // Redirect logic
      setTimeout(() => {
        if (data.role === "buyer") {
          router.push("/buyer/dashboard");
        } else {
          router.push("/vendor/dashboard");
        }
      }, 2000);

    } catch (error) {
      console.error("Auth error:", error);
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.page}>
        <Navbar />
        <View style={[styles.main, styles.mainCenter]}>
          <View style={styles.successCard}>
            <View style={styles.successRing}>
              <Text style={styles.successCheck}>✓</Text>
            </View>
            <Text style={styles.successTitle}>{mode === "login" ? "Welcome back!" : "Account created!"}</Text>
            <Text style={styles.successSub}>
              {mode === "login"
                ? `Signed in as ${role}. Taking you to your dashboard…`
                : `Welcome, ${form.name || form.email}! Your SmartVegies account is ready.`}
            </Text>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => { setSubmitted(false); switchMode("login"); }}>
              <Text style={styles.btnText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Footer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.main}>
          <View style={[styles.card, isDesktop && styles.cardDesktop]}>
            
            {/* ── LEFT PANEL (Desktop Only) ── */}
            {isDesktop && (
              <View style={styles.panelLeft}>
                <View style={styles.panelInner}>
                  <View>
                    <Text style={styles.panelEyebrow}>Farm to table, simplified</Text>
                    <Text style={styles.panelTitle}>
                      Growing together,{"\n"}
                      <Text style={styles.panelAccent}>delivered fresh.</Text>
                    </Text>
                    <Text style={styles.panelDesc}>
                      Join thousands of buyers and vendors building a fresher, more connected local food community.
                    </Text>
                  </View>

                  <View style={styles.panelFeatures}>
                    <View style={styles.panelFeature}>
                      <Text style={styles.featureEmoji}>🛒</Text>
                      <View style={styles.featureTextContainer}>
                        <Text style={styles.featureTitle}>For Buyers</Text>
                        <Text style={styles.featureDesc}>Farm-fresh produce delivered to your door. Zero hassle, maximum freshness.</Text>
                      </View>
                    </View>
                    <View style={styles.panelFeature}>
                      <Text style={styles.featureEmoji}>🌾</Text>
                      <View style={styles.featureTextContainer}>
                        <Text style={styles.featureTitle}>For Vendors</Text>
                        <Text style={styles.featureDesc}>Reach thousands of local customers. Manage your store and grow your business.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.panelImages}>
                    <Image source={{ uri: 'https://picsum.photos/seed/veg/400/300' }} style={styles.panelImg} />
                    <Image source={{ uri: 'https://picsum.photos/seed/market/400/300' }} style={styles.panelImg} />
                  </View>
                </View>
              </View>
            )}

            {/* ── RIGHT PANEL ── */}
            <View style={[styles.panelRight, isDesktop && styles.panelRightDesktop]}>
              
              <View style={styles.toggle}>
                <TouchableOpacity 
                  style={[styles.toggleBtn, mode === "login" && styles.toggleBtnOn]} 
                  onPress={() => switchMode("login")}
                >
                  <Text style={[styles.toggleBtnText, mode === "login" && styles.toggleBtnTextOn]}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleBtn, mode === "signup" && styles.toggleBtnOn]} 
                  onPress={() => switchMode("signup")}
                >
                  <Text style={[styles.toggleBtnText, mode === "signup" && styles.toggleBtnTextOn]}>Create Account</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.heading}>
                <Text style={styles.headingTitle}>{mode === "login" ? "Welcome Back" : "Get Started"}</Text>
                <Text style={styles.headingSub}>{mode === "login" ? "Sign in to your SmartVegies account." : "Create your SmartVegies account below."}</Text>
              </View>

              <View style={styles.roles}>
                <TouchableOpacity 
                  style={[styles.role, role === "buyer" && styles.roleOn]} 
                  onPress={() => { setRole("buyer"); setErrors({}); }}
                >
                  <Text style={styles.roleText}>🛒 Buyer</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.role, role === "vendor" && styles.roleOn]} 
                  onPress={() => { setRole("vendor"); setErrors({}); }}
                >
                  <Text style={styles.roleText}>🌾 Vendor</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                {mode === "signup" && (
                  <Field label="Full Name" error={errors.name}>
                    <Input icon={User} placeholder="John Doe" value={form.name} onChangeText={(v) => set("name", v)} error={errors.name} />
                  </Field>
                )}

                {mode === "signup" && role === "vendor" && (
                  <>
                    <Field label="Farm / Business Name" error={errors.farmName}>
                      <Input icon={Store} placeholder="Green Acres Farm" value={form.farmName} onChangeText={(v) => set("farmName", v)} error={errors.farmName} />
                    </Field>
                    <Field label="Location">
                      <Input icon={MapPin} placeholder="City, State" value={form.location} onChangeText={(v) => set("location", v)} />
                    </Field>
                  </>
                )}

                {mode === "signup" && (
                  <Field label="Phone Number">
                    <Input icon={Phone} placeholder="+91 00000 00000" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => set("phone", v)} />
                  </Field>
                )}

                <Field label="Email Address" error={errors.email}>
                  <Input icon={Mail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(v) => set("email", v)} error={errors.email} />
                </Field>

                <Field 
                  label={
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>Password</Text>
                      {mode === "login" && <TouchableOpacity><Text style={styles.forgot}>Forgot password?</Text></TouchableOpacity>}
                    </View>
                  }
                  error={errors.password}
                >
                  <Input 
                    icon={Lock} 
                    placeholder="••••••••" 
                    secureTextEntry={!showPw}
                    value={form.password}
                    onChangeText={(v) => set("password", v)}
                    error={errors.password}
                    rightSlot={
                      <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                        {showPw ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                      </TouchableOpacity>
                    }
                  />
                </Field>

                {mode === "signup" && (
                  <Field label="Confirm Password" error={errors.confirmPassword}>
                    <Input 
                      icon={Lock} 
                      placeholder="••••••••" 
                      secureTextEntry={!showCpw}
                      value={form.confirmPassword}
                      onChangeText={(v) => set("confirmPassword", v)}
                      error={errors.confirmPassword}
                      rightSlot={
                        <TouchableOpacity onPress={() => setShowCpw(!showCpw)}>
                          {showCpw ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                        </TouchableOpacity>
                      }
                    />
                  </Field>
                )}

                <TouchableOpacity 
                  style={styles.btnPrimary} 
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>
                      {mode === "login" ? "Sign In" : `Create ${role === "vendor" ? "Vendor" : "Buyer"} Account`}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socials}>
                <TouchableOpacity style={styles.socialBtn}>
                  <GoogleIcon />
                  <Text style={styles.socialBtnText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <FacebookIcon />
                  <Text style={styles.socialBtnText}>Facebook</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                </Text>
                <TouchableOpacity onPress={() => switchMode(mode === "login" ? "signup" : "login")}>
                  <Text style={styles.switchBtn}> {mode === "login" ? "Sign up" : "Sign in"}</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

function Navbar() {
  return (
    <View style={styles.navbar}>
      <View style={styles.navbarBrand}>
        <Leaf color="#22c55e" size={24} />
        <Text style={styles.navbarName}>SmartVegies</Text>
      </View>
      {isDesktop && (
        <View style={styles.navbarLinks}>
          <Text style={styles.navLink}>Our Mission</Text>
          <Text style={styles.navLink}>How it Works</Text>
          <Text style={styles.navLink}>Support</Text>
        </View>
      )}
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2024 SmartVegies Inc. All rights reserved.</Text>
      <View style={styles.footerLinks}>
        <Text style={styles.footerLink}>Privacy Policy</Text>
        <Text style={styles.footerLink}>Terms of Service</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
  },
  navbar: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  navbarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navbarName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  navbarLinks: {
    flexDirection: 'row',
  },
  navLink: {
    marginLeft: 24,
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  main: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCenter: {
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    overflow: 'hidden',
  },
  cardDesktop: {
    maxWidth: 1000,
    flexDirection: 'row',
    minHeight: 650,
  },
  panelLeft: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 40,
    justifyContent: 'center',
  },
  panelInner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  panelEyebrow: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  panelTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 40,
  },
  panelAccent: {
    color: '#16a34a',
  },
  panelDesc: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 16,
    lineHeight: 24,
  },
  panelFeatures: {
    marginTop: 32,
  },
  panelFeature: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  featureDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  panelImages: {
    flexDirection: 'row',
    marginTop: 32,
  },
  panelImg: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginRight: 16,
  },
  panelRight: {
    flex: 1,
    padding: 32,
  },
  panelRightDesktop: {
    padding: 48,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnOn: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  toggleBtnTextOn: {
    color: '#111827',
  },
  heading: {
    marginBottom: 32,
  },
  headingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  headingSub: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  roles: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  role: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginRight: 12,
  },
  roleOn: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  form: {
    width: '100%',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgot: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: '#fff',
  },
  inputBoxError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#111827',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    fontWeight: '500',
  },
  btnPrimary: {
    backgroundColor: '#16a34a',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: '#9ca3af',
  },
  socials: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginRight: 12,
  },
  socialBtnText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  switchText: {
    fontSize: 14,
    color: '#6b7280',
  },
  switchBtn: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '700',
  },
  successCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
  },
  successRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  successCheck: {
    fontSize: 32,
    color: '#16a34a',
    fontWeight: '700',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  successSub: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
  },
  footerLink: {
    fontSize: 13,
    color: '#6b7280',
    marginHorizontal: 12,
  }
});
