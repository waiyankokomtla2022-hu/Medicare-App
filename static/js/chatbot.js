// --- ၁။ Global Variables ---
let userAnswers = []; // လူနာရဲ့ အဖြေတွေကို သိမ်းမယ့်နေရာ
const chatTree = {
    "start": {
        "text": "မင်္ဂလာပါ၊ ကျွန်တော်က Medicare AI ဖြစ်ပါတယ်။ သင့်ရဲ့ ဝေဒနာက ဘယ်အပိုင်းမှာ အဓိကဖြစ်နေတာလဲ?",
        "options": [
            { "text": "ဖျားနာ/ချောင်းဆိုး", "next": "gp_root" },
            { "text": "ရင်ဘတ်/နှလုံး", "next": "heart_root" },
            { "text": "ဗိုက်နာ/အစာအိမ်", "next": "stomach_root" }
        ]
    },

    // ==========================================
    // (၁) အထွေထွေရောဂါကု (GP Branch) - တိုးချဲ့ထားသည်
    // ==========================================
    "gp_root": {
        "text": "ဘယ်လို ခံစားနေရတာလဲခင်ဗျာ?",
        "options": [
            { "text": "ဖျားနေလို့ပါ", "next": "gp_f_01" },
            { "text": "ချောင်းဆိုးနေလို့ပါ", "next": "gp_c_01" },
            { "text": "ကိုယ်လက်ကိုက်ခဲလို့ပါ", "next": "gp_p_01" }
        ]
    },

    // Fever Branch (မေးခွန်း ၈ ခု)
    "gp_f_01": { "text": "ဖျားတာ ၃ ရက်ထက် ကျော်နေပြီလား?", "options": [{ "text": "ကျော်ပါပြီ", "next": "gp_f_02" }, { "text": "မကျော်သေးပါဘူး", "next": "gp_f_02" }] },
    "gp_f_02": { "text": "ကိုယ်အပူချိန်က 102°F ထက် ကျော်သလား?", "options": [{ "text": "ကျော်ပါတယ်", "next": "gp_f_03" }, { "text": "မကျော်ပါဘူး", "next": "gp_f_03" }] },
    "gp_f_03": { "text": "ချမ်းတုန်တာ ဒါမှမဟုတ် တုန်တုန်ရီရီ ဖြစ်တာရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_f_04" }, { "text": "မရှိပါဘူး", "next": "gp_f_04" }] },
    "gp_f_04": { "text": "ကိုယ်ပေါ်မှာ အနီစက် ဒါမှမဟုတ် အပိန့်တွေ ထွက်လား?", "options": [{ "text": "ထွက်ပါတယ်", "next": "gp_f_05" }, { "text": "မထွက်ပါဘူး", "next": "gp_f_05" }] },
    "gp_f_05": { "text": "ခေါင်းအရမ်းကိုက်တာ သို့မဟုတ် မျက်လုံးအိမ်နောက်က အောင့်လား?", "options": [{ "text": "အောင့်ပါတယ်", "next": "gp_f_06" }, { "text": "မအောင့်ပါဘူး", "next": "gp_f_06" }] },
    "gp_f_06": { "text": "အဆစ်အမြစ်တွေ အရမ်းကိုက်ခဲနေတာမျိုးရော ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_f_07" }, { "text": "မရှိပါဘူး", "next": "gp_f_07" }] },
    "gp_f_07": { "text": "ပျို့တာ ဒါမှမဟုတ် အန်တာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_f_08" }, { "text": "မရှိပါဘူး", "next": "gp_f_08" }] },
    "gp_f_08": { "text": "အစားစားချင်စိတ် လုံးဝမရှိတာမျိုး ဖြစ်လား?", "options": [{ "text": "ဟုတ်ပါတယ်", "next": "gp_f_09" }, { "text": "မဟုတ်ပါဘူး", "next": "gp_f_09" }] },
    // GP Branch Expansion
"gp_f_09": { "text": "အနံ့ သို့မဟုတ် အရသာ လုံးဝမရတာမျိုး ဖြစ်လား?", "options": [{ "text": "ဟုတ်ပါတယ်", "next": "gp_f_10" }, { "text": "မဟုတ်ပါဘူး", "next": "gp_f_10" }] },
"gp_f_10": { "text": "လွန်ခဲ့တဲ့ ၁ ပတ်အတွင်း ခရီးသွားထားတာ ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_f_11" }, { "text": "မရှိပါဘူး", "next": "gp_f_11" }] },
"gp_f_11": { "text": "ဆီးသွားရင် ပူတာ ဒါမှမဟုတ် ဆီးခဏခဏ သွားချင်တာ ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_f_12" }, { "text": "မရှိပါဘူး", "next": "gp_f_12" }] },

"gp_f_12": { "text": "အသားဝါတာ ဒါမှမဟုတ် မျက်လုံးဝါတာမျိုး မြင်ရလား?", "options": [{ "text": "မြင်ရပါတယ်", "next": "gp_f_13" }, { "text": "မမြင်ရပါဘူး", "next": "gp_f_13" }] },
"gp_f_13": { "text": "နားထဲက အောင့်တာ ဒါမှမဟုတ် ပြည်ထွက်တာ ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_f_14" }, { "text": "မရှိပါဘူး", "next": "gp_f_14" }] },

"gp_f_14": { "text": "ညဘက်မှာ အိပ်မရအောင် ချောင်းဆိုးသလား?", "options": [{ "text": "ဆိုးပါတယ်", "next": "gp_f_15" }, { "text": "မဆိုးပါဘူး", "next": "gp_f_15" }] },
"gp_f_15": { "text": "လည်ပင်းမှာ အကျိတ်လေးတွေ ထွက်နေတာ မြင်ရလား?", "options": [{ "text": "မြင်ရပါတယ်", "next": "gp_recommend" }, { "text": "မမြင်ရပါဘူး", "next": "gp_recommend" }] },

    // Cough Branch (မေးခွန်း ၇ ခု)
    "gp_c_01": { "text": "ချောင်းဆိုးတာ သလိပ်ပါသလား?", "options": [{ "text": "ပါပါတယ်", "next": "gp_c_02" }, { "text": "မပါပါဘူး (ခြောက်ကပ်ကပ်)", "next": "gp_c_02" }] },
    "gp_c_02": { "text": "ချောင်းဆိုးတာ ၂ ပတ်ထက် ကျော်နေပြီလား?", "options": [{ "text": "ကျော်ပါပြီ", "next": "gp_c_03" }, { "text": "မကျော်သေးပါဘူး", "next": "gp_c_03" }] },
    "gp_c_03": { "text": "သလိပ်ထဲမှာ သွေးစတွေ ပါလာတာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_c_04" }, { "text": "မရှိပါဘူး", "next": "gp_c_04" }] },
    "gp_c_04": { "text": "ညဘက်မှာ ပိုဆိုးသလား သို့မဟုတ် ညဘက်ချွေးထွက်သလား?", "options": [{ "text": "ဆိုးပါတယ်/ထွက်ပါတယ်", "next": "gp_c_05" }, { "text": "မဆိုးပါဘူး", "next": "gp_c_05" }] },
    "gp_c_05": { "text": "အသက်ရှူတဲ့အခါ တရွှီရွှီ အသံမြည်သလား?", "options": [{ "text": "မြည်ပါတယ်", "next": "gp_c_06" }, { "text": "မမြည်ပါဘူး", "next": "gp_c_06" }] },
    "gp_c_06": { "text": "အသက်ရှူရတာ ကျပ်သလို ခံစားရလား?", "options": [{ "text": "ကျပ်ပါတယ်", "next": "gp_c_07" }, { "text": "မကျပ်ပါဘူး", "next": "gp_c_07" }] },

// ချောင်းဆိုးခြင်း လမ်းကြောင်း တိုးချဲ့မှု (Cough Branch Expansion)
    "gp_c_07": { "text": "ရင်ဘတ်ထဲကနေ တအောင့်အောင့်နဲ့ နာနေတာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_c_08" }, { "text": "မရှိပါဘူး", "next": "gp_c_08" }] },
    "gp_c_08": { "text": "အသက်ပြင်းပြင်းရှူလိုက်ရင် ပိုပြီး ချောင်းဆိုးသလား?", "options": [{ "text": "ဆိုးပါတယ်", "next": "gp_c_09" }, { "text": "မဆိုးပါဘူး", "next": "gp_c_09" }] },
    "gp_c_09": { "text": "သလိပ်ရဲ့ အရောင်က ဘယ်လိုရှိလဲ?", "options": [{ "text": "အဝါ/အစိမ်းရောင်", "next": "gp_c_10" }, { "text": "အကြည်ရောင်/အဖြူရောင်", "next": "gp_c_10" }] },
    "gp_c_10": { "text": "သလိပ်က အရမ်းပျစ်ပြီး ထုတ်ရခက်နေသလား?", "options": [{ "text": "ခက်ပါတယ်", "next": "gp_c_11" }, { "text": "မခက်ပါဘူး", "next": "gp_c_11" }] },
    "gp_c_11": { "text": "စကားပြောနေရင်းနဲ့တောင် အမောဖောက်ပြီး ချောင်းဆိုးတတ်လား?", "options": [{ "text": "ဆိုးတတ်ပါတယ်", "next": "gp_c_12" }, { "text": "မဆိုးပါဘူး", "next": "gp_c_12" }] },
    "gp_c_12": { "text": "ညဘက် အိပ်နေရင်း ချောင်းဆိုးလွန်းလို့ နိုးလာတတ်လား?", "options": [{ "text": "နိုးလာတတ်ပါတယ်", "next": "gp_c_13" }, { "text": "မနိုးပါဘူး", "next": "gp_c_13" }] },
    "gp_c_13": { "text": "မနက်အစောပိုင်းမှာ ချောင်းဆိုးတာ ပိုဆိုးသလား?", "options": [{ "text": "ပိုဆိုးပါတယ်", "next": "gp_c_14" }, { "text": "မဆိုးပါဘူး", "next": "gp_c_14" }] },
    "gp_c_14": { "text": "နှာခေါင်းပိတ်တာ သို့မဟုတ် နှာရည်ယိုတာ တွဲဖြစ်လား?", "options": [{ "text": "ဖြစ်ပါတယ်", "next": "gp_c_15" }, { "text": "မဖြစ်ပါဘူး", "next": "gp_c_15" }] },
    "gp_c_15": { "text": "လည်ချောင်းထဲမှာ တစ်ခုခု ခံနေသလိုမျိုး ခံစားရလား?", "options": [{ "text": "ခံစားရပါတယ်", "next": "gp_c_16" }, { "text": "မခံစားရပါဘူး", "next": "gp_c_16" }] },
    "gp_c_16": { "text": "အစားစားပြီးတဲ့အချိန်မှာ ချောင်းဆိုးတာ ပိုဖြစ်တတ်လား?", "options": [{ "text": "ဖြစ်တတ်ပါတယ်", "next": "gp_c_17" }, { "text": "မဖြစ်ပါဘူး", "next": "gp_c_17" }] },
    "gp_c_17": { "text": "မကြာခင်က ကိုယ်အလေးချိန် သိသိသာသာ ကျသွားတာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_c_18" }, { "text": "မရှိပါဘူး", "next": "gp_c_18" }] },
    "gp_c_18": { "text": "ညဘက်တွေမှာ အကြောင်းရင်းမရှိဘဲ ချွေးစေးတွေ ထွက်တတ်လား?", "options": [{ "text": "ထွက်တတ်ပါတယ်", "next": "gp_c_19" }, { "text": "မထွက်ပါဘူး", "next": "gp_c_19" }] },
    "gp_c_19": { "text": "ဆေးလိပ်သောက်တတ်တဲ့ အကျင့်ရှိလား?", "options": [{ "text": "သောက်ပါတယ်", "next": "gp_c_20" }, { "text": "မသောက်ပါဘူး", "next": "gp_c_20" }] },
    "gp_c_20": { "text": "ပတ်ဝန်းကျင်မှာ ဖုန်မှုန့် သို့မဟုတ် အနံ့အသက်ဆိုးတွေ ရှိသလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_c_21" }, { "text": "မရှိပါဘူး", "next": "gp_c_21" }] },
    "gp_c_21": { "text": "အရင်က ရင်ကျပ်ရောဂါ (Asthma) အခံ ရှိဖူးလား?", "options": [{ "text": "ရှိဖူးပါတယ်", "next": "gp_recommend" }, { "text": "မရှိပါဘူး", "next": "gp_recommend" }] },

    // ကိုယ်လက်ကိုက်ခဲခြင်း လမ်းကြောင်း (Body Ache Branch)
    "gp_p_01": {
        "text": "ကိုယ်လက်ကိုက်ခဲတာက ဘယ်လိုမျိုးလဲခင်ဗျာ?",
        "options": [
            { "text": "တစ်ခုလုံး ရိုက်ထားသလို ကိုက်တာ", "next": "gp_p_02" },
            { "text": "အဆစ်အမြစ်တွေပဲ နာတာ", "next": "gp_p_02" }
        ]
    },
    "gp_p_02": { "text": "ကိုက်ခဲတာနဲ့အမျှ ကိုယ်ပူတာ (သို့) ဖျားတာရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_p_03" }, { "text": "မရှိပါဘူး", "next": "gp_p_03" }] },
    "gp_p_03": { "text": "မကြာခင်က ပြင်းပြင်းထန်ထန် အလုပ်လုပ်ထားတာ (သို့) အားကစားလုပ်ထားတာ ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_p_04" }, { "text": "မရှိပါဘူး", "next": "gp_p_04" }] },
    "gp_p_04": { "text": "အဆစ်တွေက နီမြန်းပြီး ရောင်နေတာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_p_05" }, { "text": "မရှိပါဘူး", "next": "gp_p_05" }] },
    "gp_p_05": { "text": "မနက်အိပ်ရာနိုးရင် အဆစ်တွေ တောင့်တင်းနေတာမျိုး ဖြစ်တတ်လား?", "options": [{ "text": "ဖြစ်ပါတယ်", "next": "gp_p_06" }, { "text": "မဖြစ်ပါဘူး", "next": "gp_p_06" }] },
    "gp_p_06": { "text": "ညဘက်မှာ ကိုက်ခဲလွန်းလို့ အိပ်မရတာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_p_07" }, { "text": "မရှိပါဘူး", "next": "gp_p_07" }] },
    "gp_p_07": { "text": "ခြေလက်တွေ ထုံကျဉ်တာ သို့မဟုတ် အားမရှိသလို ခံစားရလား?", "options": [{ "text": "ခံစားရပါတယ်", "next": "gp_p_08" }, { "text": "မခံစားရပါဘူး", "next": "gp_p_08" }] },
    "gp_p_08": { "text": "မကြာသေးခင်ကမှ ဆေးဝါးအသစ်တစ်ခုခု သောက်ထားတာ ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_p_09" }, { "text": "မရှိပါဘူး", "next": "gp_p_09" }] },
    "gp_p_09": { "text": "အသားအရေတွေ ခြောက်သွေ့တာ သို့မဟုတ် ဆံပင်ကျွတ်တာရော ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gp_p_10" }, { "text": "မရှိပါဘူး", "next": "gp_p_10" }] },
    "gp_p_10": { "text": "ခြေဖမိုး သို့မဟုတ် ခြေကျင်းဝတ်တွေ ဖောရောင်နေလား?", "options": [{ "text": "ရောင်နေပါတယ်", "next": "gp_p_11" }, { "text": "မရောင်ပါဘူး", "next": "gp_p_11" }] },
    "gp_p_11": { "text": "အရင်က လေးဖက်နာ (Rheumatism) ရောဂါအခံ ရှိဖူးလား?", "options": [{ "text": "ရှိဖူးပါတယ်", "next": "gp_p_12" }, { "text": "မရှိပါဘူး", "next": "gp_p_12" }] },
    "gp_p_12": { "text": "မျက်လုံးတွေ နီတာ (သို့) မျက်စိမှုန်တာမျိုး တွဲဖြစ်လား?", "options": [{ "text": "ဖြစ်ပါတယ်", "next": "gp_p_13" }, { "text": "မဖြစ်ပါဘူး", "next": "gp_p_13" }] },
    "gp_p_13": { "text": "ဆီးအရောင်က အရမ်းရင့်နေတာ သို့မဟုတ် လက်ဖက်ရည်ကြမ်းရောင် ဖြစ်နေလား?", "options": [{ "text": "ဟုတ်ပါတယ်", "next": "gp_p_14" }, { "text": "မဟုတ်ပါဘူး", "next": "gp_p_14" }] },
    "gp_p_14": { "text": "အစာစားချင်စိတ် လျော့နည်းပြီး အရမ်းနုံးနေတာလား?", "options": [{ "text": "ဟုတ်ပါတယ်", "next": "gp_p_15" }, { "text": "မဟုတ်ပါဘူး", "next": "gp_p_15" }] },
    "gp_p_15": { "text": "ကိုက်ခဲတာက တစ်ပတ်ထက် ပိုကြာနေပြီလား?", "options": [{ "text": "ကြာပါပြီ", "next": "gp_recommend" }, { "text": "မကြာသေးပါဘူး", "next": "gp_recommend" }] },
    // ==========================================
    // (၂) နှလုံးရောဂါ (Heart Branch) - တိုးချဲ့ထားသည်
    // ==========================================
    "heart_root": {
        "text": "နှလုံးနဲ့ ပတ်သက်ပြီး ဘယ်လို ခံစားရတာလဲ?",
        "options": [
            { "text": "ရင်ဘတ်အောင့်လို့ပါ", "next": "ht_p_01" },
            { "text": "ရင်တုန်နေလို့ပါ", "next": "ht_palp_01" },
        ]
    },

    "ht_p_01": { "text": "အောင့်တာက တင်းကျပ်ပြီး ဖိထားသလိုပဲလား?", "options": [{ "text": "ဟုတ်ပါတယ်", "next": "ht_p_02" }, { "text": "စူးခနဲ တစစ်စစ် ဖြစ်တာပါ", "next": "ht_p_02" }] },
    "ht_p_02": { "text": "အောင့်တာက မိနစ် ၂၀ ထက် ကြာသလား?", "options": [{ "text": "ကြာပါတယ်", "next": "ht_p_03" }, { "text": "ခဏပဲ အောင့်တာပါ", "next": "ht_p_03" }] },
    "ht_p_03": { "text": "မေးရိုး သို့မဟုတ် ပခုံးအထိ ပျံ့အောင့်သလား?", "options": [{ "text": "ပျံ့ပါတယ်", "next": "ht_p_04" }, { "text": "မပျံ့ပါဘူး", "next": "ht_p_04" }] },
    "ht_p_04": { "text": "အောင့်တဲ့အချိန်မှာ ချွေးစေးတွေ ထွက်သလား?", "options": [{ "text": "ထွက်ပါတယ်", "next": "ht_p_05" }, { "text": "မထွက်ပါဘူး", "next": "ht_p_05" }] },
    "ht_p_05": { "text": "မူးဝေတာ ဒါမှမဟုတ် သတိလစ်ချင်သလို ဖြစ်သလား?", "options": [{ "text": "ဖြစ်ပါတယ်", "next": "ht_p_06" }, { "text": "မဖြစ်ပါဘူး", "next": "ht_p_06" }] },
    "ht_p_06": { "text": "လှေကားတက်ရင် သို့မဟုတ် လှုပ်ရှားရင် ပိုမောသလား?", "options": [{ "text": "ပိုမောပါတယ်", "next": "ht_p_07" }, { "text": "မမောပါဘူး", "next": "ht_p_07" }] },
    "ht_p_07": { "text": "သွေးတိုး၊ ဆီးချို သို့မဟုတ် နှလုံးရောဂါအခံ ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "ht_p_08" }, { "text": "မရှိပါဘူး", "next": "ht_p_08" }] },
    "ht_p_08": { "text": "လက်ရှိမှာ ဆေးလိပ်သောက်တတ်သူလား?", "options": [{ "text": "သောက်ပါတယ်", "next": "ht_p_09" }, { "text": "မသောက်ပါဘူး", "next": "ht_p_09" }] },
    // Heart Branch Expansion
    "ht_p_09": { "text": "အိပ်ပျော်နေရင်း အသက်ရှူကျပ်လို့ နိုးလာတတ်သလား?", "options": [{ "text": "နိုးလာတတ်ပါတယ်", "next": "ht_p_10" }, { "text": "မနိုးပါဘူး", "next": "ht_p_10" }] },
    "ht_p_10": { "text": "ခြေဖမိုး သို့မဟုတ် ခြေကျင်းဝတ်တွေ ဖောရောင်နေလား?", "options": [{ "text": "ရောင်နေပါတယ်", "next": "ht_p_11" }, { "text": "မရောင်ပါဘူး", "next": "ht_p_11" }] },
    "ht_p_11": { "text": "ရင်တုန်တဲ့အခါ နှလုံးခုန်တာ စည်းချက်မမှန်သလို ခံစားရလား?", "options": [{ "text": "မှန်ပါတယ်", "next": "ht_p_12" }, { "text": "မမှန်ပါဘူး", "next": "ht_p_12" }] },
    "ht_p_12": { "text": "ခေါင်းထဲက အုန်းအုန်းနဲ့ မြည်တာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "ht_p_13" }, { "text": "မရှိပါဘူး", "next": "ht_p_13" }] },
    "ht_p_13": { "text": "မျက်စိဝေဝါးတာ ဒါမှမဟုတ် ဇက်ကြောတက်တာ ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "ht_p_14" }, { "text": "မရှိပါဘူး", "next": "ht_p_14" }] },
    "ht_p_14": { "text": "မိသားစုထဲမှာ နှလုံးရောဂါအခံ ရှိသူ ရှိသလား?", "options": [{ "text": "ရှိပါတယ်", "next": "ht_p_15" }, { "text": "မရှိပါဘူး", "next": "ht_p_15" }] },
    "ht_p_15": { "text": "အရင်ကထက် လှုပ်ရှားရတာ ပိုမောလာသလား?", "options": [{ "text": "ပိုမောလာပါတယ်", "next": "cardio_recommend" }, { "text": "ပုံမှန်ပါပဲ", "next": "cardio_recommend" }] },
    
    // --- ရင်တုန်ခြင်းဆိုင်ရာ မေးခွန်းများ (Palpitation Branch) ---

"ht_palp_01": { "text": "ရင်တုန်တာက ဘယ်လိုမျိုးလဲ? နှလုံးခုန်မြန်တာလား ဒါမှမဟုတ် စည်းချက်လွဲနေသလိုလား?", "options": [{ "text": "အဆက်မပြတ် မြန်နေတာပါ", "next": "ht_palp_02" }, { "text": "တချက်တချက် ခုန်ပျံသွားသလိုမျိုးပါ", "next": "ht_palp_02" }] },
"ht_palp_02": { "text": "ရင်တုန်တဲ့အချိန်မှာ အသက်ရှူရတာ မဝသလို ခံစားရသလား?", "options": [{ "text": "ရှူရခက်ပါတယ်", "next": "ht_palp_03" }, { "text": "ပုံမှန်ပါပဲ", "next": "ht_palp_03" }] },
"ht_palp_03": { "text": "ရင်တုန်နေတုန်း ရင်ဘတ်ထဲက အောင့်တာ သို့မဟုတ် တင်းကျပ်တာ ရှိလား?", "options": [{ "text": "အောင့်ပါတယ်", "next": "ht_palp_04" }, { "text": "မအောင့်ပါဘူး", "next": "ht_palp_04" }] },
"ht_palp_04": { "text": "မူးဝေတာ၊ မျက်စိပြာတာ သို့မဟုတ် သတိလစ်ချင်သလို ဖြစ်တတ်သလား?", "options": [{ "text": "ဖြစ်တတ်ပါတယ်", "next": "ht_palp_05" }, { "text": "မဖြစ်ပါဘူး", "next": "ht_palp_05" }] },
"ht_palp_05": { "text": "ကော်ဖီ၊ လက်ဖက်ရည် သို့မဟုတ် အားဖြည့်အချိုရည် သောက်ထားတာ ရှိသလား?", "options": [{ "text": "သောက်ထားပါတယ်", "next": "ht_palp_06" }, { "text": "မသောက်ပါဘူး", "next": "ht_palp_06" }] },
"ht_palp_06": { "text": "စိတ်ဖိစီးမှုများတာ ဒါမှမဟုတ် စိုးရိမ်စိတ် လွန်ကဲနေတာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "ht_palp_07" }, { "text": "မရှိပါဘူး", "next": "ht_palp_07" }]},
"ht_palp_07": { "text": "လည်ပင်းမှာရှိတဲ့ သိုင်းရွိုက် (Thyroid) အကြိတ် ရောဂါအခံ ရှိသလား?", "options": [{ "text": "ရှိပါတယ်", "next": "ht_palp_08" }, { "text": "မရှိပါဘူး", "next": "ht_palp_08" }] },
"ht_palp_08": { "text": "နားထဲမှာ နှလုံးခုန်သံ ကြားနေရတာမျိုး ရှိသလား?", "options": [{ "text": "ကြားရပါတယ်", "next": "ht_palp_09" }, { "text": "မကြားရပါဘူး", "next": "ht_palp_09" }] },
"ht_palp_09": { "text": "ရင်တုန်တာက အနားယူနေချိန်မှာ ဖြစ်တာလား ဒါမှမဟုတ် လှုပ်ရှားမှ ဖြစ်တာလား?", "options": [{ "text": "အနားယူနေလည်း ဖြစ်ပါတယ်", "next": "ht_palp_10" }, { "text": "လှုပ်ရှားမှ ဖြစ်တာပါ", "next": "ht_palp_10" }] },
"ht_palp_10": { "text": "လက်ရှိမှာ ကိုယ်အလေးချိန် ရုတ်တရက် ကျသွားတာမျိုး ရှိလား?", "options": [{ "text": "ကျသွားပါတယ်", "next": "cardio_recommend" }, { "text": "မကျပါဘူး", "next": "cardio_recommend" }] },
    
    // (၃) အစာအိမ်နှင့် အူလမ်းကြောင်း (Stomach Branch) - တိုးချဲ့ထားသည်
    // ==========================================
    "stomach_root": {
        "text": "ဗိုက်ထဲမှာ ဘယ်လို ဖြစ်နေတာလဲ?",
        "options": [
            { "text": "ရင်ညွန့်က ပူနေလို့ပါ", "next": "st_g_01" },
            { "text": "ဗိုက်အောင့်နေလို့ပါ", "next": "st_p_01" }
        ]
    },
    // --- ရင်ပူခြင်း/အစာခြေစနစ်ဆိုင်ရာ မေးခွန်းများ (Gastritis/GERD Branch) ---

"st_g_01": { 
    "text": "အစားစားပြီးရင် အချဉ်ရည် ဆန်တက်တာမျိုး ရှိလား?", 
    "options": [{ "text": "ရှိပါတယ်", "next": "st_g_02" }, { "text": "မရှိပါဘူး", "next": "st_g_02" }] 
},

"st_g_02": { 
    "text": "ရင်ဘတ်ထဲက ပူစပ်ပူလောင် ဖြစ်တာမျိုးက ညဘက်မှာ ပိုဆိုးတတ်သလား?", 
    "options": [{ "text": "ညဘက်ပိုဆိုးပါတယ်", "next": "st_g_03" }, { "text": "ပုံမှန်ပါပဲ", "next": "st_g_03" }] 
},

"st_g_03": { 
    "text": "အစာမျိုရတာ ခက်ခဲတာ ဒါမှမဟုတ် နာတာမျိုး ရှိလား?", 
    "options": [{ "text": "ရှိပါတယ်", "next": "st_g_04" }, { "text": "မရှိပါဘူး", "next": "st_g_04" }] 
},

"st_g_04": { 
    "text": "ဗိုက်အောင့်တဲ့အခါ လေတက်လိုက်ရင် သက်သာသွားသလား?", 
    "options": [{ "text": "သက်သာပါတယ်", "next": "st_g_05" }, { "text": "မသက်သာပါဘူး", "next": "st_g_05" }] 
},

"st_g_05": { 
    "text": "အမြဲတမ်းလိုလို လေပွနေတာ ဒါမှမဟုတ် ဗိုက်ကယ်နေတာမျိုး ဖြစ်တတ်သလား?", 
    "options": [{ "text": "ဖြစ်တတ်ပါတယ်", "next": "st_g_06" }, { "text": "မဖြစ်ပါဘူး", "next": "st_g_06" }] 
},

"st_g_06": { 
    "text": "အစားစားချင်စိတ် လျော့နည်းသွားတာမျိုး ရှိလား?", 
    "options": [{ "text": "ရှိပါတယ်", "next": "st_g_07" }, { "text": "မရှိပါဘူး", "next": "st_g_07" }] 
},

"st_g_07": { 
    "text": "မကြာခဏ ပျို့အန်တာမျိုး ဖြစ်တတ်သလား?", 
    "options": [{ "text": "ဖြစ်တတ်ပါတယ်", "next": "st_g_08" }, { "text": "မဖြစ်ပါဘူး", "next": "st_g_08" }] 
},

"st_g_08": { 
    "text": "အစာမစားခင် ဗိုက်ထဲက ပိုအောင့်တတ်သလား ဒါမှမဟုတ် စားပြီးမှ အောင့်တာလား?", 
    "options": [{ "text": "မစားခင် အောင့်တာပါ", "next": "st_g_09" }, { "text": "စားပြီးမှ အောင့်တာပါ", "next": "st_g_09" }] 
},

"st_g_09": { 
    "text": "ဝမ်းသွားတဲ့ အလေ့အထက ပုံမှန်မဟုတ်ဘဲ ပြောင်းလဲနေသလား? (ဥပမာ- ဝမ်းချုပ်လိုက် ဝမ်းလျှောလိုက်)", 
    "options": [{ "text": "ပြောင်းလဲနေပါတယ်", "next": "st_g_10" }, { "text": "ပုံမှန်ပါပဲ", "next": "st_g_10" }] 
},

"st_g_10": { 
    "text": "စပ်တဲ့အစားအစာ ဒါမှမဟုတ် အဆီအစိမ့်တွေ စားရင် ပိုဆိုးသလား?", 
    "options": [{ "text": "ပိုဆိုးပါတယ်", "next": "gastrio_recommend" }, { "text": "မဆိုးပါဘူး", "next": "gastrio_recommend" }] 
},

    "st_p_01": { "text": "ဗိုက်နာတာက ဘယ်နေရာမှာလဲ?", "options": [{ "text": "ရင်ညွန့်/အပေါ်ပိုင်း", "next": "st_p_02" }, { "text": "ချက်နား/အောက်ပိုင်း", "next": "st_p_02" }] },
    "st_p_02": { "text": "အစာစားပြီးရင် ပိုနာသလား ဒါမှမဟုတ် သက်သာသွားလား?", "options": [{ "text": "ပိုနာပါတယ်", "next": "st_p_03" }, { "text": "သက်သာသွားပါတယ်", "next": "st_p_03" }] },
    "st_p_03": { "text": "ဗိုက်က တင်းပြီး လေပွနေတာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "st_p_04" }, { "text": "မရှိပါဘူး", "next": "st_p_04" }] },
    "st_p_04": { "text": "ဝမ်းသွားရင် အမည်းရောင်တွေ ပါသလား?", "options": [{ "text": "ပါပါတယ်", "next": "st_p_05" }, { "text": "မပါပါဘူး", "next": "st_p_05" }] },
    "st_p_05": { "text": "ပျို့တာ ဒါမှမဟုတ် အန်တာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "st_p_06" }, { "text": "မရှိပါဘူး", "next": "st_p_06" }] },
    "st_p_06": { "text": "မကြာခင်က ကိုယ်အလေးချိန် သိသိသာသာ ကျသွားလား?", "options": [{ "text": "ကျပါတယ်", "next": "st_p_07" }, { "text": "မကျပါဘူး", "next": "st_p_07" }] },
// Stomach Branch Expansion
"st_p_07": { "text": "ဝမ်းသွားရင် သွေးစတွေ ပါတာမျိုး ရှိလား?", "options": [{ "text": "ပါပါတယ်", "next": "st_p_08" }, { "text": "မပါပါဘူး", "next": "st_p_08" }] },
"st_p_08": { "text": "ဝမ်းသွားတာ တစ်ပတ်မှာ ၃ ကြိမ်ထက် နည်းသလား?", "options": [{ "text": "နည်းပါတယ်", "next": "st_p_09" }, { "text": "ပုံမှန်ပါပဲ", "next": "st_p_09" }] },
"st_p_09": { "text": "အစာစားပြီးရင် ဗိုက်ထဲမှာ တင်းပြီး လေထိုးသလို ဖြစ်လား?", "options": [{ "text": "ဖြစ်ပါတယ်", "next": "st_p_10" }, { "text": "မဖြစ်ပါဘူး", "next": "st_p_10" }] },
"st_p_10": { "text": "ဗိုက်နာတာက ခါးနောက်ဘက်အထိ ပျံ့သွားသလား?", "options": [{ "text": "ပျံ့ပါတယ်", "next": "st_p_11" }, { "text": "မပျံ့ပါဘူး", "next": "st_p_11" }] },
"st_p_11": { "text": "ဝမ်းသွားလိုက်ရင် ဗိုက်နာတာ သက်သာသွားသလား?", "options": [{ "text": "သက်သာပါတယ်", "next": "st_p_12" }, { "text": "မသက်သာပါဘူး", "next": "st_p_12" }] },
"st_p_12": { "text": "နို့ထွက်ပစ္စည်း စားတဲ့အခါ ဗိုက်နာတတ်သလား?", "options": [{ "text": "နာတတ်ပါတယ်", "next": "st_p_13" }, { "text": "မနာပါဘူး", "next": "st_p_13" }] },
"st_p_13": { "text": "အစာစားချင်စိတ် လုံးဝမရှိတာ ဘယ်လောက်ကြာပြီလဲ?", "options": [{ "text": "၁ ပတ်ကျော်ပြီ", "next": "st_p_14" }, { "text": "မကြာသေးပါဘူး", "next": "st_p_14" }] },
"st_p_14": { "text": "ဝမ်းပျက်လိုက်၊ ဝမ်းချုပ်လိုက် တစ်လှည့်စီ ဖြစ်သလား?", "options": [{ "text": "ဖြစ်ပါတယ်", "next": "st_p_15" }, { "text": "မဖြစ်ပါဘူး", "next": "st_p_15" }] },
"st_p_15": { "text": "ဗိုက်ထဲမှာ တစ်ခုခု အလုံးစမ်းမိတာမျိုး ရှိလား?", "options": [{ "text": "ရှိပါတယ်", "next": "gastrio_recommend" }, { "text": "မရှိပါဘူး", "next": "gastrio_recommend" }] },
    // --- Recommendation End Points ---
    "gp_recommend": { "text": "သင့်လက္ခဏာများကို စစ်ဆေးပြီးပါပြီ။ **အထွေထွေရောဂါကု (GP)** နှင့် အသေးစိတ်ပြသရန် အကြံပြုပါတယ်။", "options": [{ "text": "ပြန်စမည်", "next": "start" }] },
    "cardio_recommend": { "text": "နှလုံးနှင့် ပတ်သက်သော ဝေဒနာဖြစ်နိုင်ခြေ ရှိနေပါသည်။ **နှလုံးအထူးကု** နှင့် ရက်ချိန်းယူပြသပါ။", "options": [{ "text": "ပြန်စမည်", "next": "start" }] },
    "cardio_emergency": { "text": "⚠️ **သတိပေးချက်:** အသက်အန္တရာယ်ရှိသော နှလုံးဝေဒနာ ဖြစ်နိုင်ပါသည်။ နီးစပ်ရာ အရေးပေါ်ဌာနသို့ ချက်ချင်းသွားပါ။", "options": [{ "text": "ပြန်စမည်", "next": "start" }] },
    "gastrio_recommend": { "text": "အစာအိမ်နှင့် အူလမ်းကြောင်းဆိုင်ရာ ပြဿနာဖြစ်နိုင်ပါသည်။ **အစာအိမ်အထူးကု** နှင့် ပြသပါ။", "options": [{ "text": "ပြန်စမည်", "next": "start" }] },
    "gp_f_end": { "text": "လောလောဆယ် ရေများများသောက်ပြီး အနားယူပါ။ မသက်သာပါက ဆရာဝန်ပြပါ။", "options": [{ "text": "ပြန်စမည်", "next": "start" }] }

};

function displayMessage(text, sender) {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return;
    const msgDiv = document.createElement('div');
    msgDiv.style.maxWidth = "80%";
    msgDiv.className = sender === 'bot' ? 'bg-success text-white p-3 rounded-4 mb-3' : 'bg-primary text-white p-3 rounded-4 mb-3 align-self-end';
    msgDiv.innerHTML = `<strong>${sender === 'bot' ? 'Bot' : 'You'}:</strong><br>${text}`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- Global Function: AI Recommendation အရ ဆရာဝန်ရှာပေးရန် ---
function showSuggestedDoctors(department) {
    // ၁။ AI Chat Modal ကို ပိတ်မည်
    const aiModalElement = document.getElementById('aiChatbotModal');
    const aiModal = bootstrap.Modal.getInstance(aiModalElement);
    if (aiModal) aiModal.hide();
    // ၂။ ဆရာဝန်ရှာဖွေရေး Modal ကို ဖွင့်မည်
    const docModalElement = document.getElementById('doctorListModal');
    const docModal = new bootstrap.Modal(docModalElement);
    docModal.show();
    // ၃။ Search Box ထဲတွင် Specialty ကို မြန်မာလိုပြပြီး Filter လုပ်မည်
    const searchInput = document.getElementById('doctorSearchInput');
    if (searchInput) {
        let dbSearchKey = ""; // Database ထဲက အင်္ဂလိပ် Specialty
        let myanmarName = ""; // မြန်မာလိုပြမယ့်အမည်
        // ဌာနအလိုက် Mapping လုပ်ခြင်း
        if (department.includes("အထွေထွေ")) {
            dbSearchKey = "General";
            myanmarName = "အထွေထွေရောဂါအထူးပြု";
        } else if (department.includes("နှလုံး")) {
            dbSearchKey = "Cardiology";
            myanmarName = "နှလုံးအထူးကု";
        } else if (department.includes("အစာအိမ်")) {
            dbSearchKey = "Gastroenterology";
            myanmarName = "အစာအိမ်/အူလမ်းကြောင်း";

        }
        // Search Input ထဲတွင် မြန်မာလို ရေးသားမည်
        searchInput.value = myanmarName;
        // ဌာနအမည်များကို Filter လုပ်ရန် (မြန်မာ/အင်္ဂလိပ် နှစ်မျိုးလုံး တိုက်စစ်နိုင်ရန်)
        filterDoctorsBySpecialty(dbSearchKey, myanmarName);
    }
}

// Specialty နှစ်မျိုးလုံးဖြင့် Filter လုပ်နိုင်သည့် Function အသစ်
function filterDoctorsBySpecialty(englishKey, myanmarKey) {
    let items = document.querySelectorAll('.doctor-item');
    items.forEach(item => {
        let specialty = item.querySelector('.specialty-text').innerText.toLowerCase();
        // Database ထဲက အင်္ဂလိပ်စာလုံး (သို့) မြန်မာစာလုံး ပါ/မပါ စစ်ဆေးသည်
        if (specialty.includes(englishKey.toLowerCase()) || specialty.includes(myanmarKey)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

// --- ပြင်ဆင်ထားသော showOptions Function ---
function showOptions(stepKey) {
    // manual_chat.js ထဲမှာ သုံးထားတဲ့ message container ID ကို သုံးပါ
    const chatContainer = document.getElementById('chatMessages'); 
    if (!chatContainer) return;
   
    if (!chatTree[stepKey]) {
        console.error("Error: မေးခွန်း ID '" + stepKey + "' ကို chatTree ထဲမှာ ရှာမတွေ့ပါ။");
        return;
    }

    const step = chatTree[stepKey];
    
    // displayMessage အစား manual_chat.js က appendManualChatMessage ကို သုံးပါ (စာသားပုံစံ တူသွားအောင်)
    appendManualChatMessage(step.text, 'bot');

    // ခလုတ်များ ထည့်ရန် Div အသစ်တစ်ခု ဆောက်မည်
    const btnGroup = document.createElement('div');
    btnGroup.className = 'text-center my-3 choice-group'; 

    // Recommendation အပိုင်း (မူလအတိုင်း)
    if (stepKey.includes('recommend')) {
        let deptName = "";
        if (stepKey === "gp_recommend") deptName = "အထွေထွေရောဂါကု";
        if (stepKey === "cardio_recommend") deptName = "နှလုံးအထူးကု";
        if (stepKey === "gastrio_recommend") deptName = "အစာအိမ်အထူးကု";
        
        const docBtn = document.createElement('button');
        docBtn.className = 'btn btn-primary rounded-pill mb-2 w-75 shadow';
        docBtn.innerHTML = `<i class="fas fa-user-md me-2"></i>${deptName} ဆရာဝန်များကြည့်မည်`;
        docBtn.onclick = () => showSuggestedDoctors(deptName);
        btnGroup.appendChild(docBtn);
    }

    // Choice ခလုတ်များ ထုတ်ပေးခြင်း
    step.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-success rounded-pill mb-2 w-100 shadow-sm px-4';
        btn.type = 'button';
        btn.innerText = option.text;
        btn.onclick = (e) => {
            e.preventDefault();
            // ခလုတ်နှိပ်ပြီးရင် ဒီအုပ်စုကို ဖျက်မယ်
            btnGroup.remove();
            
            appendManualChatMessage(option.text, 'user');
            
            const positiveKeywords = ["ဟုတ်", "ရှိ", "ကျော်", "ဆိုး", "ပါသည်", "ဖြစ်", "အောင့်", "နာ"];
            const isPositive = positiveKeywords.some(kw => option.text.includes(kw));
            if (isPositive) {
                userAnswers.push({ question: step.text, answer: option.text });
            }
            
            setTimeout(() => showOptions(option.next), 600);
        };
        btnGroup.appendChild(btn);
    });

    chatContainer.appendChild(btnGroup);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
function displaySummary() {
    const chatWindow = document.getElementById('chat-window');
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'bg-light text-dark p-3 rounded-4 mb-3 border border-success';

    // မေးခွန်းနဲ့ အဖြေအားလုံးကို စုစည်းခြင်း
    let listItems = userAnswers.map(ans => `
        <div style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
            <p style="margin: 0; font-size: 14px; color: #333;"><b>မေးခွန်း:</b> ${ans.question}</p>
            <p style="margin: 5px 0 0 15px; font-size: 14px; color: #28a745;"><b>အဖြေ:</b> ${ans.answer}</p>
        </div>
    `).join('');

    summaryDiv.innerHTML = `
        <div id="report-content" style="background: white; padding: 30px; width: 100%; min-height: auto;">
            <h3 style="text-align: center; color: #198754; margin-bottom: 20px;">Medicare AI ဆေးမှတ်တမ်း</h3>
            <p style="text-align: right; font-size: 12px;">ရက်စွဲ: ${new Date().toLocaleDateString('my-MM')}</p>
            <hr>
            <div id="answers-list">
                ${listItems || "<p>ထူးခြားသော လက္ခဏာများ မတွေ့ရှိပါ။</p>"}
            </div>
            <hr>
            <p style="font-size: 11px; color: #666; text-align: center;">ဤသည်မှာ AI ၏ ကနဦးစစ်ဆေးမှုသာ ဖြစ်ပါသည်။</p>
        </div>
        <button onclick="downloadPDF()" class="btn btn-success mt-3 w-100 shadow-sm">

            <i class="fas fa-file-pdf"></i> PDF သိမ်းမည်

        </button>

    `;
    chatWindow.appendChild(summaryDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// PDF Download လုပ်ပေးမယ့် function (jspdf library လိုအပ်သည်)
function downloadPDF() {
    const element = document.getElementById('report-content');
    // PDF ထုတ်နေစဉ်အတွင်း ယာယီ Styling ပြောင်းမည်
    const originalStyle = element.style.cssText;
    element.style.height = 'auto'; // အမြင့်ကို အကန့်အသတ်မထားရန်
    element.style.overflow = 'visible'; // ဖုံးကွယ်ထားတာမျိုး မရှိစေရန်
    const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5], // [top, left, bottom, right]
        filename:     'Medical_Report_Complete.pdf',
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  {
            scale: 3, // စာလုံးကြည်လင်ရန်
            useCORS: true,
            scrollY: 0,
            windowHeight: element.scrollHeight // Element ရဲ့ အမြင့်အထိ ရိုက်ယူရန်
        },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } // စာမျက်နှာ ကွဲမသွားအောင်
    };
    html2pdf().set(opt).from(element).save().then(() => {
        // PDF ထုတ်ပြီးရင် မူလ Style ပြန်ထားမည်
        element.style.cssText = originalStyle;
    });
}

function resetChat() {
    userAnswers = []; // အဖြေဟောင်းများ ဖျက်ပစ်မည်
    const chatWin = document.getElementById('chat-window');
    const chatOpt = document.getElementById('chat-options');
    if (chatWin) chatWin.innerHTML = '';
    if (chatOpt) chatOpt.innerHTML = '';
    showOptions('start');
}

// --- ၂။ Doctor Filter Logic ---
function filterDoctors() {
    let input = document.getElementById('doctorSearchInput').value.toLowerCase();
    let items = document.querySelectorAll('.doctor-item');
    items.forEach(item => {
        let name = item.querySelector('.doctor-name').innerText.toLowerCase();
        let specialty = item.querySelector('.specialty-text').innerText.toLowerCase();
        item.style.display = (name.includes(input) || specialty.includes(input)) ? "block" : "none";
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // AI Chatbot Initialization
    const aiModal = document.getElementById('aiChatbotModal');
    if (aiModal) {
        aiModal.addEventListener('shown.bs.modal', function () {
            if (document.getElementById('chat-window').innerHTML.trim() === "") {
                showOptions('start');
            }
        });
    }
    // --- ၃။ Flash Messages Logic ---
    setTimeout(function() {
        let flashMessages = document.querySelectorAll('.flash-message');
        flashMessages.forEach(function(msg) {
            let alert = new bootstrap.Alert(msg);
            alert.close();
        });
    }, 3000);

    // --- ၄။ အသံမြည်စနစ် Logic ---
    const aheadCounts = document.querySelectorAll('.ahead-count');
    let isItTime = false;
    aheadCounts.forEach(el => { if(parseInt(el.innerText) === 0) isItTime = true; });
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.loop = true;
    const triggerAlarm = () => {
        if (isItTime) {
            audio.play().then(() => {
                setTimeout(() => {
                    alert("🔔 သင့်အလှည့်ရောက်ပါပြီ! \n\nကျေးဇူးပြု၍ ဆေးခန်းအတွင်းသို့ ဝင်ရောက်ပေးပါခင်ဗျာ။");
                    audio.pause();
                    audio.currentTime = 0;
                }, 500);
            }).catch(e => console.log("Sound interaction required."));
        }
        document.removeEventListener('click', triggerAlarm);
    };
    document.addEventListener('click', triggerAlarm);
    // --- ၅။ အတိတ်ရက်စွဲ တားဆီးခြင်း Logic ---
    const setMinDate = () => {
        const today = new Date();
        const minDateString = today.toISOString().split('T')[0];
        document.querySelectorAll('.date-input').forEach(input => {
            input.setAttribute('min', minDateString);
        });
    };
    setMinDate();
    // --- ၆။ Booking & Slot Checking Logic ---
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('show.bs.modal', function () {
            const dateInput = modal.querySelector('.date-input');
            if(!dateInput) return;
            const bookBtn = modal.querySelector('.book-btn');
            const daysElement = modal.querySelector('.days-text');
            const doctorIdInput = modal.querySelector('input[name="doctor_id"]');
            dateInput.addEventListener('change', function() {
                const selectedDay = new Date(this.value).toLocaleDateString('en-US', {weekday: 'short'});
                if (!daysElement.innerText.includes(selectedDay)) {
                    alert("ရွေးချယ်ထားသောရက်စွဲသည် ဆရာဝန်ပြသသောရက် မဟုတ်ပါ။");
                    this.value = '';
                    bookBtn.disabled = true;
                    bookBtn.innerText = "ရက်စွဲရွေးချယ်ပေးပါ";
                    return;
                }
                bookBtn.innerText = "စစ်ဆေးနေသည်...";
                fetch(`/check_slots?doctor_id=${doctorIdInput.value}&date=${this.value}`)
                    .then(res => res.json()).then(data => {
                        if(data.remaining <= 0) {
                            bookBtn.disabled = true;
                            bookBtn.innerText = "လူပြည့်ပါပြီ";
                        } else {
                            bookBtn.disabled = false;
                            bookBtn.innerText = `ဘွတ်ကင်လုပ်မည် (${data.remaining} နေရာကျန်)`;
                        }
                    });
            });
        });
    });
});