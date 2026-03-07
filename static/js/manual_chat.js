// ၁။ Global Variables များကို တစ်ခါပဲ ကြေညာပါ
let currentStep = 0;
let totalAskedCount = 0;
let currentCategory = null;
let scores = { "heart": 0, "stomach": 0, "general": 0 };
let isEmergency = false;

document.addEventListener('DOMContentLoaded', function() {
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');

    if (sendBtn) sendBtn.addEventListener('click', processMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') processMessage();
        });
    }

    // ဒီနေရာမှာ function ကို လှမ်းခေါ်လိုက်ရုံပါပဲ
    setTimeout(showInitialWelcome, 500);
});

// --- Function အသစ်အဖြစ် ထုတ်ရေးလိုက်တာပါ ---
function showInitialWelcome() {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;

    appendManualChatMessage("မင်္ဂလာပါ။ Medicare Chat AI မှ ကြိုဆိုပါတယ်။ ဘယ်လိုနည်းလမ်းနဲ့ စစ်ဆေးလိုပါသလဲ?", 'bot');
    
    const entryDiv = document.createElement('div');
    entryDiv.className = 'text-center my-3';
    entryDiv.id = 'entry-options'; 

    // manual_chat.js ထဲက နေရာ
entryDiv.innerHTML = `
    <button class="btn btn-outline-primary rounded-pill m-2 px-4 shadow-sm" onclick="startManualMode()">
        <i class="fas fa-keyboard"></i> စာရိုက်ပြီး ပြောပြမည်
    </button>
    <button class="btn btn-outline-success rounded-pill m-2 px-4 shadow-sm" onclick="startChoiceMode()">
        <i class="fas fa-list-ul"></i> မေးခွန်းများ ဖြေဆိုမည်
    </button>
`;
    chatContainer.appendChild(entryDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function processMessage() {
    const inputField = document.getElementById('chatInput');
    const userText = inputField.value.trim();
    if (!userText) return;

    appendManualChatMessage(userText, 'user');
    inputField.value = '';

    let lowerInput = userText.toLowerCase();
    if (lowerInput.includes("တော်ပြီ") || lowerInput.includes("မဖြေတော့ဘူး") || lowerInput.includes("ရပ်မယ်")) {
        appendManualChatMessage("ဟုတ်ကဲ့ပါ၊ ဒါဆိုရင် အခုဖြေထားသလောက် အဖြေတွေနဲ့ပဲ ရလဒ်ကို တွက်ချက်ပေးလိုက်ပါ့မယ်။", 'bot');
        
        setTimeout(() => {
            let rules = window.ruleBasedRules;
            showFinalSummary(rules); // တိုက်ရိုက် ရလဒ်ပြတဲ့ function ကို ခေါ်လိုက်တာပါ
        }, 1000);
        
        return; // အောက်က logic တွေကို ဆက်မလုပ်အောင် ရပ်လိုက်တာပါ
    }
    
    setTimeout(() => {
        let db = window.keywordDatabase;
        let rules = window.ruleBasedRules;
        let lowerInput = userText.toLowerCase();

        isEmergency = false;

let sevDB = window.severityKeywords;
        if (sevDB.high.some(k => lowerInput.includes(k))) {
            isEmergency = true;
        }

        // အရေးပေါ်အခြေအနေဖြစ်ပါက ချက်ချင်း သတိပေးမည်
        if (isEmergency) {
            appendManualChatMessage("⚠️ **သတိပြုရန်:** သင်ဖော်ပြသော လက္ခဏာမှာ ပြင်းထန်ပုံရပါသည်။ မေးခွန်းများကို ဆက်ဖြေနေခြင်းထက် နီးစပ်ရာ အရေးပေါ်ဌာနသို့ ချက်ချင်းသွားရောက်ရန် သို့မဟုတ် ဆရာဝန်နှင့် အမြန်ဆုံးပြသရန် အကြံပြုပါသည်!", 'bot');
            // Emergency ဖြစ်ပေမဲ့လည်း လူနာက ဆက်မေးချင်ရင် မေးလို့ရအောင်တော့ ထားပေးရပါမယ်
        }

        // ရမှတ်တွက်ချက်ပုံတွင် Severity ကို Weight ပေးခြင်း
        if (isEmergency) scores[currentCategory] += 10; // အရမ်းနာရင် အမှတ်ပိုပေးမယ်

        // ၂။ Keyword Detection & Scoring
        let detectedDept = null;
        for (const [dept, keywords] of Object.entries(db)) {
            if (keywords.some(k => lowerInput.includes(k))) {
                scores[dept] += 5; // ရောဂါလက္ခဏာ keyword မိရင် ၅ မှတ်ပေးမယ်
                detectedDept = dept;
            }
        }

        // ၃။ Initial Category Setup & Dynamic Path Switching
        // ၄။ Smart Category Setup & Clarification Loop
        if (!currentCategory) {
            if (detectedDept) {
                // Keyword Database နှင့် ကိုက်ညီမှုရှိမှသာ Category သတ်မှတ်မည်
                currentCategory = detectedDept;
            } else {
                // *** အဓိကပြင်ဆင်ချက်- Keyword မမိပါက Default Category သို့ မပို့တော့ဘဲ ပြန်မေးမည် ***
                appendManualChatMessage("နားလည်ပေးပါခင်ဗျာ။ အခုဖော်ပြတဲ့ လက္ခဏာကို ကျွန်တော် သေချာနားမလည်လို့ပါ။ ပိုမိုတိကျစေဖို့ 'ရင်ဘတ်အောင့်တယ်'၊ 'ဗိုက်နာတယ်' စသဖြင့် လက္ခဏာတစ်ခုခုကို တိတိကျကျလေး ပြန်ပြောပေးနိုင်မလား?", 'bot');
                
                // မေးခွန်း ၂၀ ဆက်မမေးဘဲ ဤနေရာတွင် ရပ်တန့်ထားမည် (Proceed to Question Processing သို့ မသွားသေးပါ)
                return; 
            }
        } else if (detectedDept && detectedDept !== currentCategory) {
            // လက္ခဏာအသစ် ထပ်မံတွေ့ရှိပါက Dynamic Path Switching လုပ်ဆောင်မည်
            currentCategory = detectedDept;
            currentStep = 0; // မေးခွန်းအသစ်မှ ပြန်စမည်
            appendManualChatMessage(`သတိပြုမိပါတယ်၊ အခုပြောပြတဲ့ "${userText}" နဲ့ ပတ်သက်တာကို အသေးစိတ် ပြန်စစ်ဆေးပေးပါ့မယ်။`, 'bot');
        }

        // ၄။ Smart Validation Logic
        if (currentStep > 0) {
            const currentQuestions = rules[currentCategory].questions;
            const lastQuestion = currentQuestions[(currentStep - 1) % currentQuestions.length];
            
            // "ဟုတ်/ရှိ/နာ" စတဲ့ စကားလုံးတွေပါရင် လက်ခံမယ်
            let positiveWords = ["ဟုတ်", "ရှိ", "အေး", "နာ", "ဖြစ်", "မှန်", "ဘဲ", "တယ်","ခံစား", "ထွက်", "ခက်ခဲပါ", "ဖြစ်", "နည်း","ပါ"];
            let negativeWords = ["မရှိ", "ဟင့်အင်း", "မဟုတ်", "မဖြစ်", "မရှိပါ","မပါ", "မခံစားရ", "မထွက်", "မခက်ခဲ", "မဖြစ်", "မ"];
            
            let isPositive = positiveWords.some(w => lowerInput.includes(w)) || detectedDept;
            let isNegative = negativeWords.some(w => lowerInput.includes(w));

            // မေးခွန်းက "လား/သလား" ဖြစ်ပြီး အဖြေက ရေရေရာရာမရှိရင် တားမြစ်မယ်
            if (!isPositive && !isNegative && (lastQuestion.includes("လား") || lastQuestion.includes("သလား"))) {
                appendManualChatMessage("နားလည်ပါတယ်ခင်ဗျာ။ ဒါပေမဲ့ ဒီမေးခွန်းလေးကို 'ရှိပါတယ်' ဒါမှမဟုတ် 'မရှိပါဘူး' စသဖြင့် တိတိကျကျလေး အရင်ဖြေပေးပါဦး။", 'bot');
                return;
            }
            
            if (isPositive) scores[currentCategory] += 2; // အပြုသဘောဖြေရင် ၂ မှတ်တိုးမယ်
        }

        // ၅။ Question Progression
        if (totalAskedCount < 20) {
            const currentQuestions = rules[currentCategory].questions;
            const nextQuestion = currentQuestions[currentStep % currentQuestions.length];
            appendManualChatMessage(nextQuestion, 'bot');
            
            currentStep++;
            totalAskedCount++;
        } else {
            // မေးခွန်း ၂၀ ပြည့်ရင် ရလဒ်ပြမယ်
            showFinalSummary(rules);
        }
    }, 800);
}

// ၆။ Final Summary Function (နာမည်တူတွေကို တစ်ခုပဲ ထားပါ)
function showFinalSummary(rules) {
    let topDept = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    let finalRule = rules[topDept];

    appendManualChatMessage("မေးခွန်း ၂၀ စလုံးကို စိတ်ရှည်စွာ ဖြေဆိုပေးလို့ ကျေးဇူးတင်ပါတယ်။", 'bot');
    appendManualChatMessage(`📊 **ရမှတ်အနှစ်ချုပ်:** \n- နှလုံး: ${scores.heart} \n- အစာအိမ်: ${scores.stomach} \n- အထွေထွေ: ${scores.general}`, 'bot');
    appendManualChatMessage(`🔍 သင်၏ အဖြေများအရ **${finalRule.department}** နှင့် အကိုက်ညီဆုံး ဖြစ်နေပါသည်။`, 'bot');
    appendManualChatMessage(`🏥 **အကြံပြုချက်:** ${finalRule.finalSuggestion}`, 'bot');
    
    // --- အဓိကပြင်ဆင်ချက်- Button ထည့်သွင်းခြင်း ---
    setTimeout(() => {
        const chatContainer = document.getElementById('chatMessages');
        const btnDiv = document.createElement('div');
        btnDiv.className = 'text-center my-3';
        
        // သင်ရေးထားတဲ့ showSuggestedDoctors function ကို လှမ်းခေါ်တဲ့ ခလုတ်
        btnDiv.innerHTML = `
            <button class="btn btn-primary rounded-pill px-4 shadow-sm" 
                    onclick="showSuggestedDoctors('${finalRule.department}')">
                ${finalRule.department} ဆရာဝန်များကြည့်မည်
            </button>
        `;
        chatContainer.appendChild(btnDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);

    // စနစ်ကို Reset လုပ်မယ်
    currentStep = 0; totalAskedCount = 0; currentCategory = null;
    scores = { "heart": 0, "stomach": 0, "general": 0 };
}

function resetChatSystem() {
    // ၁။ Variables များကို Reset လုပ်ခြင်း
    currentStep = 0;
    totalAskedCount = 0;
    currentCategory = null;
    scores = { "heart": 0, "stomach": 0, "general": 0 };
    isEmergency = false;

    // ၂။ Chat UI ကို ရှင်းလင်းခြင်း
    const chatContainer = document.getElementById('chatMessages');
    if (chatContainer) chatContainer.innerHTML = '';

    // ၃။ Input Box ကို ပြန်ဖျောက်ခြင်း (စာရိုက်မယ့် mode မရွေးရသေးခင် ဖျောက်ထားဖို့ပါ)
    const inputArea = document.getElementById('chatInputArea');
    if (inputArea) inputArea.style.display = 'none';

    // ၄။ အစကနေ ပြန်ပြခိုင်းခြင်း
    showInitialWelcome();
}

function appendManualChatMessage(text, sender) {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'text-end mb-3' : 'mb-3';
    msgDiv.innerHTML = `<span class="p-2 px-3 d-inline-block shadow-sm" style="background-color: ${sender === 'user' ? '#00d2ff' : '#28a745'}; color: white; border-radius: 15px; max-width: 80%; text-align: left;">${text}</span>`;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showSymptomsSuggestions() {
    const chatContainer = document.getElementById('chatMessages');
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'suggestion-chips mb-3 text-center';
    
    // လူနာရွေးချယ်နိုင်မည့် အဓိက လက္ခဏာစုများ
    const suggestions = ["ရင်ဘတ်အောင့်တယ်", "ဗိုက်နာတယ်", "အထွေထွေနေမကောင်းဖြစ်လို့"];
    
    suggestions.forEach(text => {
        const btn = document.createElement('button');
        btn.innerHTML = text;
        // style ကို တန်းထည့်ပေးထားပါတယ် (CSS သီးသန့်ရေးစရာမလိုအောင်)
        btn.style = "background: white; border: 1px solid #28a745; color: #28a745; border-radius: 20px; padding: 5px 15px; margin: 5px; cursor: pointer; transition: 0.3s; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);";
        
        btn.onmouseover = () => { btn.style.background = "#28a745"; btn.style.color = "white"; };
        btn.onmouseout = () => { btn.style.background = "white"; btn.style.color = "#28a745"; };

        btn.onclick = () => {
            document.getElementById('chatInput').value = text;
            processMessage();
            suggestionDiv.remove(); 
        };
        suggestionDiv.appendChild(btn);
    });
    
    chatContainer.appendChild(suggestionDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ၁။ စာရိုက်မည့်လမ်းကြောင်း (Manual Mode)
// ၁။ Manual Mode စတင်တဲ့အခါ ခလုတ် ၃ ခုအရင်ပြမယ်
function startManualMode() {
    const entryOptions = document.getElementById('entry-options');
    if (entryOptions) entryOptions.remove();

    appendManualChatMessage("စာရိုက်ပြီး ပြောပြမည် ကို ရွေးချယ်ခဲ့ပါတယ်။", 'user');
    
    // Input Area ကို ခဏပိတ်ထားဦးမယ် (ရောဂါအရင်ရွေးခိုင်းဖို့)
    const inputArea = document.getElementById('chatInputArea');
    if (inputArea) inputArea.style.display = 'none';

    appendManualChatMessage("ဟုတ်ကဲ့ပါ၊ ပိုမိုတိကျတဲ့ မေးခွန်းတွေမေးနိုင်ဖို့ သင့်ရဲ့ ဝေဒနာနဲ့ အနီးစပ်ဆုံး အမျိုးအစားကို အရင်ရွေးပေးပါခင်ဗျာ။", 'bot');

    // ရောဂါ ၃ မျိုး ရွေးခိုင်းတဲ့ ခလုတ်များ
    const chatContainer = document.getElementById('chatMessages');
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'text-center my-3 symptom-selection-area';

    // manual_chat.js ထဲက နေရာ
categoryDiv.innerHTML = `
    <button class="btn btn-outline-danger rounded-pill m-2 px-4 shadow-sm" onclick="selectManualCategory('heart')">
        <i class="fas fa-heartbeat"></i> နှလုံး/ရင်ဘတ်
    </button>
    <button class="btn btn-outline-warning rounded-pill m-2 px-4 shadow-sm" onclick="selectManualCategory('stomach')">
        <i class="fas fa-stomach"></i> ဗိုက်နာ/အစာအိမ်
    </button>
    <button class="btn btn-outline-info rounded-pill m-2 px-4 shadow-sm" onclick="selectManualCategory('general')">
        <i class="fas fa-thermometer-half"></i> ဖျားနာ/အထွေထွေ
    </button>
`;
    chatContainer.appendChild(categoryDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ၂။ အမျိုးအစား ရွေးပြီးမှ စာရိုက်ခိုင်းမည့် function
function selectManualCategory(category) {
    // လက်ရှိ category ကို global variable ထဲ ထည့်လိုက်ပြီ
    currentCategory = category;
    
    // ရွေးချယ်မှု ခလုတ်တွေကို ဖျက်မယ်
    const selectionArea = document.querySelector('.symptom-selection-area');
    if (selectionArea) selectionArea.remove();

    // လူနာရွေးတာကို ပြမယ်
    const labels = { 'heart': 'နှလုံး/ရင်ဘတ်', 'stomach': 'ဗိုက်နာ/အစာအိမ်', 'general': 'ဖျားနာ/အထွေထွေ' };
    appendManualChatMessage(labels[category] + " ကို ရွေးချယ်ခဲ့သည်။", 'user');

    // စာရိုက်မည့် box ကို အခုမှ ပြမယ်
    const inputArea = document.getElementById('chatInputArea');
    if (inputArea) {
        inputArea.style.display = 'block';
        document.getElementById('chatInput').focus();
    }

    // Bot က ပထမဆုံးမေးခွန်းကို စမေးမယ်
    const firstQuestion = window.ruleBasedRules[category].questions[0];
    appendManualChatMessage(`ဟုတ်ကဲ့ပါ၊ ${labels[category]} နဲ့ ပတ်သက်ပြီး စစ်ဆေးပေးပါ့မယ်။ \n\n ${firstQuestion}`, 'bot');
    
    // မေးခွန်းအမှတ်စဉ်ကို ၁ တိုးထားမယ် (နောက်တစ်ခါ စာရိုက်ရင် ဒုတိယမေးခွန်းသွားဖို့)
    currentStep = 1;
    totalAskedCount = 1;
}

// ၂။ မေးခွန်းဖြေဆိုမည့်လမ်းကြောင်း (Choice Mode - chatbot.js သို့ လွှဲပြောင်းခြင်း)
function startChoiceMode() {
    const entryOptions = document.getElementById('entry-options');
    if (entryOptions) entryOptions.remove();

    appendManualChatMessage("မေးခွန်းများ ဖြေဆိုမည် ကို ရွေးချယ်ခဲ့ပါတယ်။", 'user');

    // Input Area ကို သေချာပေါက် ဖျောက်ထားမယ်
    const inputArea = document.getElementById('chatInputArea');
    if (inputArea) inputArea.style.display = 'none';

    if (typeof showOptions === "function") {
        showOptions('start'); // chatbot.js ထဲက flow စမယ်
    }
}