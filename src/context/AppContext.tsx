import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PACKAGES, INITIAL_ADDONS, INITIAL_MEMBERSHIPS } from '../data/seedData';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User | null) => void;
  loginUser: (email: string) => boolean;
  registerUser: (userData: { full_name: string; email: string; phone: string; referral_code_used?: string }) => User;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (userData: { full_name: string; email: string; phone: string; password: string; referral_code_used?: string }) => Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;

  // Navigation
  currentPage: string;
  setCurrentPage: (page: string, params?: Record<string, string>) => void;
  pageParams: Record<string, string>;

  // Vehicles
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'visits_count'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getUserVehicles: (userId: string) => Vehicle[];

  // Services & Pricing
  packages: ServicePackage[];
  addons: AddonService[];
  memberships: MembershipPlan[];
  updatePackage: (id: string, updates: Partial<ServicePackage>) => void;
  updateAddon: (id: string, updates: Partial<AddonService>) => void;

  // Bookings
  bookings: AppointmentBooking[];
  createBooking: (booking: Omit<AppointmentBooking, 'id' | 'created_at' | 'status'>) => AppointmentBooking;
  updateBookingStatus: (id: string, status: AppointmentBooking['status']) => void;

  // Visit Records & Plate Tracking
  visitRecords: VehicleVisitRecord[];
  lookupPlate: (plate: string) => {
    plate: string;
    totalVisits: number;
    records: VehicleVisitRecord[];
    registeredVehicle?: Vehicle;
    loyaltyCard?: LoyaltyCardData;
  };
  recordStaffCheckIn: (data: {
    plate_number: string;
    vehicle_type: VehicleType;
    vehicle_summary: string;
    service_package_id: string;
    addon_ids: string[];
    photo_url?: string;
    customer_name?: string;
    customer_phone?: string;
    notes?: string;
    payment_method: PaymentMethod;
    redeem_free_wash?: boolean;
  }) => { record: VehicleVisitRecord; freeWashEarned: boolean };

  // Loyalty System
  loyaltyCards: Record<string, LoyaltyCardData>;
  getLoyaltyCardForPlate: (plate: string) => LoyaltyCardData;
  redeemFreeWash: (plate: string) => boolean;

  // Referrals
  applyReferralCode: (code: string) => { valid: boolean; discountAmount: number; message: string };

  // Chat & Messages
  messages: ChatMessage[];
  sendMessage: (text: string, plateNumber?: string) => void;
  markMessagesAsRead: () => void;

  // Questions
  questions: Question[];
  askQuestion: (q: { subject: string; category: Question['category']; message: string }) => Question;
  answerQuestion: (questionId: string, answer: string) => void;

  // PayPal Simulation
  payPalModalState: {
    isOpen: boolean;
    amount: number;
    description: string;
    onSuccess?: () => void;
  };
  openPayPal: (amount: number, description: string, onSuccess: () => void) => void;
  closePayPal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'wcw_current_user_v2',
  USERS: 'wcw_users_v2',
  VEHICLES: 'wcw_vehicles_v2',
  PACKAGES: 'wcw_packages_v2',
  ADDONS: 'wcw_addons_v2',
  BOOKINGS: 'wcw_bookings_v2',
  VISITS: 'wcw_visits_v2',
  LOYALTY: 'wcw_loyalty_v2',
  MESSAGES: 'wcw_messages_v2',
  QUESTIONS: 'wcw_questions_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) return JSON.parse(saved);
    return null;
  });

  // Supabase session/profile hydration
  useEffect(() => {
    let active = true;

    const hydrateUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      if (!session?.user) {
        setCurrentUser(null);
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
      if (!active) return;
      const metadata = session.user.user_metadata || {};
      setCurrentUser({
        id: session.user.id,
        email: session.user.email || '',
        full_name: profile?.full_name || metadata.full_name || '',
        phone: profile?.phone || metadata.phone || '',
        role: profile?.role || 'customer',
        created_at: profile?.created_at || session.user.created_at,
        referral_code: profile?.referral_code,
        referred_by: profile?.referred_by,
        discount_balance: Number(profile?.discount_balance || 0),
      } as User);
    };

    hydrateUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      void hydrateUser();
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const signUp = async (userData: { full_name: string; email: string; phone: string; password: string; referral_code_used?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email.trim(),
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name.trim(),
          phone: userData.phone.trim(),
          referral_code_used: userData.referral_code_used?.trim() || null,
        },
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true, needsEmailConfirmation: !data.session };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  // Navigation
  const [currentPage, setCurrentPageState] = useState<string>('landing');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  const setCurrentPage = (page: string, params: Record<string, string> = {}) => {
    setCurrentPageState(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return saved ? JSON.parse(saved) : [];
  });

  // Packages & Addons
  const [packages, setPackages] = useState<ServicePackage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [addons, setAddons] = useState<AddonService[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADDONS);
    return saved ? JSON.parse(saved) : INITIAL_ADDONS;
  });

  const [memberships] = useState<MembershipPlan[]>(INITIAL_MEMBERSHIPS);

  // Bookings
  const [bookings, setBookings] = useState<AppointmentBooking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : [];
  });

  // Visit Records
  const [visitRecords, setVisitRecords] = useState<VehicleVisitRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VISITS);
    return saved ? JSON.parse(saved) : [];
  });

  // Loyalty Cards
  const [loyaltyCards, setLoyaltyCards] = useState<Record<string, LoyaltyCardData>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOYALTY);
    return saved ? JSON.parse(saved) : {};
  });

  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : [];
  });

  // Questions
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  // PayPal Modal
  const [payPalModalState, setPayPalModalState] = useState<{
    isOpen: boolean;
    amount: number;
    description: string;
    onSuccess?: () => void;
  }>({
    isOpen: false,
    amount: 0,
    description: '',
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADDONS, JSON.stringify(addons));
  }, [addons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visitRecords));
  }, [visitRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOYALTY, JSON.stringify(loyaltyCards));
  }, [loyaltyCards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  // Auth Functions
  const loginUser = (email: string): boolean => {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const registerUser = (userData: { full_name: string; email: string; phone: string; referral_code_used?: string }): User => {
    const referralCode = `${userData.full_name.split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    
    // Check if referral code used is valid
    let discountBalance = 0;
    if (userData.referral_code_used) {
      const referrer = users.find((u) => u.referral_code.toUpperCase() === userData.referral_code_used?.toUpperCase());
      if (referrer) {
        // Reward referrer with R20
        setUsers((prev) =>
          prev.map((u) => (u.id === referrer.id ? { ...u, discount_balance: u.discount_balance + 20 } : u))
        );
        // New customer gets R20 welcome credit
        discountBalance = 20;
      }
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: userData.email.trim(),
      full_name: userData.full_name.trim(),
      phone: userData.phone.trim(),
      role: 'customer',
      created_at: new Date().toISOString(),
      referral_code: referralCode,
      referred_by: userData.referral_code_used,
      discount_balance: discountBalance,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  // Vehicles
  const addVehicle = (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'visits_count'>): Vehicle => {
    const normalizedPlate = vehicleData.plate_number.toUpperCase().trim();
    // Count historical visits if plate was previously checked in
    const historicalVisits = visitRecords.filter((v) => v.plate_number.toUpperCase().trim() === normalizedPlate).length;

    const newVehicle: Vehicle = {
      ...vehicleData,
      plate_number: normalizedPlate,
      id: `veh-${Date.now()}`,
      created_at: new Date().toISOString(),
      visits_count: historicalVisits,
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const getUserVehicles = (userId: string) => {
    return vehicles.filter((v) => v.user_id === userId);
  };

  // Pricing
  const updatePackage = (id: string, updates: Partial<ServicePackage>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const updateAddon = (id: string, updates: Partial<AddonService>) => {
    setAddons((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  // Bookings
  const createBooking = (bookingData: Omit<AppointmentBooking, 'id' | 'created_at' | 'status'>): AppointmentBooking => {
    const newBooking: AppointmentBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'pending',
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: AppointmentBooking['status']) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const completed_at = status === 'completed' ? new Date().toISOString() : b.completed_at;
          return { ...b, status, completed_at };
        }
        return b;
      })
    );
  };

  // Plate Lookup & Check-In
  const lookupPlate = (plate: string) => {
    const cleanPlate = plate.toUpperCase().trim();
    const records = visitRecords.filter((r) => r.plate_number.toUpperCase().trim() === cleanPlate);
    const registeredVehicle = vehicles.find((v) => v.plate_number.toUpperCase().trim() === cleanPlate);
    const loyaltyCard = loyaltyCards[cleanPlate];

    return {
      plate: cleanPlate,
      totalVisits: records.length,
      records,
      registeredVehicle,
      loyaltyCard,
    };
  };

  const getLoyaltyCardForPlate = (plate: string): LoyaltyCardData => {
    const cleanPlate = plate.toUpperCase().trim();
    if (loyaltyCards[cleanPlate]) {
      return loyaltyCards[cleanPlate];
    }
    // Calculate from records
    const fullWashVisits = visitRecords.filter(
      (r) => r.plate_number.toUpperCase().trim() === cleanPlate && r.loyalty_stamp_awarded
    ).length;

    const currentStamps = fullWashVisits % 4;
    const totalEarned = Math.floor(fullWashVisits / 4);

    return {
      plate_number: cleanPlate,
      current_stamps: currentStamps,
      total_full_washes: fullWashVisits,
      total_free_washes_earned: totalEarned,
      total_free_washes_redeemed: 0,
    };
  };

  const redeemFreeWash = (plate: string): boolean => {
    const cleanPlate = plate.toUpperCase().trim();
    const card = getLoyaltyCardForPlate(cleanPlate);
    if (card.current_stamps === 3 || card.total_free_washes_earned > card.total_free_washes_redeemed) {
      setLoyaltyCards((prev) => ({
        ...prev,
        [cleanPlate]: {
          ...card,
          current_stamps: 0,
          total_free_washes_redeemed: card.total_free_washes_redeemed + 1,
          last_stamped_at: new Date().toISOString(),
        },
      }));
      return true;
    }
    return false;
  };

  const recordStaffCheckIn = (data: {
    plate_number: string;
    vehicle_type: VehicleType;
    vehicle_summary: string;
    service_package_id: string;
    addon_ids: string[];
    photo_url?: string;
    customer_name?: string;
    customer_phone?: string;
    notes?: string;
    payment_method: PaymentMethod;
    redeem_free_wash?: boolean;
  }) => {
    const cleanPlate = data.plate_number.toUpperCase().trim();
    const selectedPkg = packages.find((p) => p.id === data.service_package_id);
    if (!selectedPkg) {
      throw new Error('No service package is configured. Add a service package before recording a wash.');
    }
    const selectedAddons = addons.filter((a) => data.addon_ids.includes(a.id));

    // Calculate cost
    let pkgCost = 0;
    if (data.vehicle_type === 'sedan') pkgCost = selectedPkg.price_sedan;
    else if (data.vehicle_type === 'suv') pkgCost = selectedPkg.price_suv;
    else pkgCost = selectedPkg.price_bakkie;

    const addonsCost = selectedAddons.reduce((acc, a) => acc + a.price, 0);
    let totalCost = pkgCost + addonsCost;

    let isFreeRewardApplied = false;
    if (data.redeem_free_wash) {
      totalCost = Math.max(0, totalCost - pkgCost);
      isFreeRewardApplied = true;
    }

    const countsForLoyalty = selectedPkg.counts_for_loyalty && !isFreeRewardApplied;

    // Update loyalty
    let freeWashEarned = false;
    const currentCard = getLoyaltyCardForPlate(cleanPlate);
    let nextStamps = currentCard.current_stamps;
    let nextEarned = currentCard.total_free_washes_earned;
    let nextRedeemed = currentCard.total_free_washes_redeemed;

    if (isFreeRewardApplied) {
      nextStamps = 0;
      nextRedeemed += 1;
    } else if (countsForLoyalty) {
      nextStamps = currentCard.current_stamps + 1;
      if (nextStamps >= 4) {
        nextStamps = 0;
        nextEarned += 1;
        freeWashEarned = true;
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }

    setLoyaltyCards((prev) => ({
      ...prev,
      [cleanPlate]: {
        plate_number: cleanPlate,
        customer_name: data.customer_name || currentCard.customer_name,
        current_stamps: nextStamps,
        total_full_washes: currentCard.total_full_washes + (countsForLoyalty ? 1 : 0),
        total_free_washes_earned: nextEarned,
        total_free_washes_redeemed: nextRedeemed,
        last_stamped_at: new Date().toISOString(),
      },
    }));

    const newRecord: VehicleVisitRecord = {
      id: `rec-${Date.now()}`,
      plate_number: cleanPlate,
      vehicle_type: data.vehicle_type,
      vehicle_summary: data.vehicle_summary,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      photo_url: data.photo_url,
      service_package_name: selectedPkg.name,
      addon_names: selectedAddons.map((a) => a.name),
      date: new Date().toISOString().split('T')[0],
      amount_paid: totalCost,
      payment_method: data.payment_method,
      staff_name: currentUser?.full_name || undefined,
      notes: data.notes,
      loyalty_stamp_awarded: countsForLoyalty,
      is_free_reward_applied: isFreeRewardApplied,
      timestamp: new Date().toISOString(),
    };

    setVisitRecords((prev) => [newRecord, ...prev]);

    // Update vehicle visits count if exists
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.plate_number.toUpperCase().trim() === cleanPlate) {
          return {
            ...v,
            visits_count: v.visits_count + 1,
            last_visit_date: new Date().toISOString().split('T')[0],
            photo_url: data.photo_url || v.photo_url,
          };
        }
        return v;
      })
    );

    return { record: newRecord, freeWashEarned };
  };

  // Referral Code Check
  const applyReferralCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { valid: false, discountAmount: 0, message: 'Please enter a referral code.' };

    if (currentUser && currentUser.referral_code.toUpperCase() === cleanCode) {
      return { valid: false, discountAmount: 0, message: 'You cannot use your own referral code.' };
    }

    const referrer = users.find((u) => u.referral_code.toUpperCase() === cleanCode);
    if (referrer) {
      return {
        valid: true,
        discountAmount: 20, // R20 off for both parties!
        message: `Valid code from ${referrer.full_name}! R20 discount applied to this wash.`,
      };
    }

    // Default welcome discount code
    if (cleanCode === 'WALDRIFT20' || cleanCode === 'FREE4TH') {
      return {
        valid: true,
        discountAmount: 20,
        message: 'Promotional discount applied! R20 saved.',
      };
    }

    return { valid: false, discountAmount: 0, message: 'Invalid or expired referral code.' };
  };

  // Messages
  const sendMessage = (text: string, plateNumber?: string) => {
    if (!currentUser || !text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_role: currentUser.role,
      receiver_id: currentUser.role === 'customer' ? 'all_staff' : undefined,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      plate_number: plateNumber,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Only persist messages actually sent by authenticated users.
    // No automated or fabricated staff replies are generated.
  };

  const markMessagesAsRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  };

  // Questions
  const askQuestion = (q: { subject: string; category: Question['category']; message: string }): Question => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      customer_id: currentUser?.id || '',
      customer_name: currentUser?.full_name || '',
      customer_email: currentUser?.email || '',
      subject: q.subject.trim(),
      category: q.category,
      message: q.message.trim(),
      status: 'open',
      created_at: new Date().toISOString(),
    };

    setQuestions((prev) => [newQ, ...prev]);
    return newQ;
  };

  const answerQuestion = (questionId: string, answer: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            status: 'answered',
            answer: answer.trim(),
            answered_by: currentUser?.full_name ? `${currentUser.full_name} (${currentUser.role})` : undefined,
            answered_at: new Date().toISOString(),
          };
        }
        return q;
      })
    );
  };

  // PayPal
  const openPayPal = (amount: number, description: string, onSuccess: () => void) => {
    setPayPalModalState({
      isOpen: true,
      amount,
      description,
      onSuccess,
    });
  };

  const closePayPal = () => {
    setPayPalModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        loginUser,
        registerUser,
        logout,
        signIn,
        signUp,
        signOut,
        currentPage,
        setCurrentPage,
        pageParams,
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        getUserVehicles,
        packages,
        addons,
        memberships,
        updatePackage,
        updateAddon,
        bookings,
        createBooking,
        updateBookingStatus,
        visitRecords,
        lookupPlate,
        recordStaffCheckIn,
        loyaltyCards,
        getLoyaltyCardForPlate,
        redeemFreeWash,
        applyReferralCode,
        messages,
        sendMessage,
        markMessagesAsRead,
        questions,
        askQuestion,
        answerQuestion,
        payPalModalState,
        openPayPal,
        closePayPal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
