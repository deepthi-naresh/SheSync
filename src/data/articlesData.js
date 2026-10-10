/**
 * SheSync Curated Educational Health Guides
 * Verified evidence-based articles with verifiable public-health source citations.
 */

export const ARTICLE_CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'menstrual', label: 'Menstrual & Cycle Health' },
  { id: 'pregnancy', label: 'Pregnancy & Maternal Care' },
  { id: 'postpartum', label: 'Postpartum & Baby Basics' },
  { id: 'wellness', label: 'Hormonal Wellness' },
];

export const ARTICLES_CATALOG = [
  // --- 1. PREGNANCY SIGNS & TESTING ---
  {
    id: 'art-p1',
    title: 'Early Pregnancy Signs & When to Take a Test',
    category: 'pregnancy',
    topic: 'Pregnancy Testing',
    readTime: '4 min read',
    summary: 'Recognizing early hormonal changes, understanding hCG hormone rise, and why cycle tracking alone cannot diagnose pregnancy.',
    fullContent: `Early pregnancy involves significant hormonal shifts governed by Human Chorionic Gonadotropin (hCG), progesterone, and estrogen.

### Common Early Signs:
1. Missed Menstrual Period: Usually the earliest and most recognizable indicator for individuals with regular menstrual cycles.
2. Tender, Swollen Breasts: Hormonal surges cause breast tissue sensitivity and darkening of the areolas within 1–2 weeks of conception.
3. Mild Implantation Spotting or Cramping: Light, short-lived spotting may occur 6–12 days after fertilization as the blastocyst attaches to the uterine wall.
4. Fatigue & Nausea: Elevated progesterone levels cause notable daytime fatigue, while morning sickness (which can occur at any time of day) typically begins around weeks 4–6.
5. Increased Urinary Frequency: Expanding blood volume and hormonal changes increase kidney filtration.

### When & How to Test:
- Optimal Timing: Take a home urine pregnancy test from the first day of your missed period, or at least 14 days after ovulation. Testing too early can yield a false-negative result because urinary hCG concentration may still be below test sensitivity thresholds.
- Best Practice: Use your first-morning urine, which has the highest concentration of hCG.

### Critical Educational Advisory:
Cycle tracking provides mathematical estimates of fertile windows based on historical dates. Cycle tracking apps CANNOT confirm or rule out pregnancy. If your period is delayed and pregnancy is possible, confirm with a clinical urine test or quantitative blood hCG test overseen by a healthcare professional.`,
    sources: [
      'World Health Organization (WHO) — Standards for Maternal Health',
      'Ministry of Health and Family Welfare (MoHFW), Govt. of India — Maternal Health Guidelines',
      'National Health Service (NHS UK) — Doing a Pregnancy Test'
    ]
  },

  // --- 2. PREGNANCY BY TRIMESTER ---
  {
    id: 'art-p2',
    title: 'Pregnancy by Trimester: Body Changes & Milestones',
    category: 'pregnancy',
    topic: 'Trimester Guide',
    readTime: '5 min read',
    summary: 'A clinical overview of fetal development milestones and maternal physiological adaptations across all three trimesters.',
    fullContent: `A standard full-term pregnancy spans approximately 40 weeks, divided into three distinct trimesters:

### First Trimester (Weeks 1 to 12): Foundation & Organogenesis
- Fetal Milestones: The neural tube, heart, limbs, and vital organ systems form. By week 12, the fetus is approximately 6 cm long with recognizable features.
- Maternal Changes: Significant progesterone and hCG rise, morning sickness, heightened olfactory sensitivity, emotional swings, and frequent urination. The uterus expands to about the size of a grapefruit.

### Second Trimester (Weeks 13 to 26): The "Golden Trimester"
- Fetal Milestones: Rapid skeletal growth, hair/eyebrow development, and active movement. Fetal swallowing and hearing develop.
- Maternal Changes: Nausea often subsides and physical energy typically rebounds. "Quickening" (first felt fetal movements) occurs between weeks 16–22. The expanding belly may cause mild round ligament stretching discomfort.

### Third Trimester (Weeks 27 to 40+): Growth & Preparation for Birth
- Fetal Milestones: Rapid brain and lung maturation, significant subcutaneous fat accumulation, and positioning (usually head-down) for birth.
- Maternal Changes: Increased pelvic pressure, shortness of breath (as the diaphragm is pushed upward), mild ankle swelling, and occasional painless practice contractions (Braxton Hicks). Frequent resting is encouraged.`,
    sources: [
      'American College of Obstetricians and Gynecologists (ACOG) — How Your Fetus Grows During Pregnancy',
      'National Health Service (NHS UK) — You and Your Baby at 1-40 Weeks',
      'MoHFW India — Guidelines for Antenatal Care and Skilled Attendance at Birth'
    ]
  },

  // --- 3. ANTENATAL CARE ---
  {
    id: 'art-p3',
    title: 'Antenatal Care (ANC): Routine Visits & Clinician Questions',
    category: 'pregnancy',
    topic: 'Clinical Care',
    readTime: '4 min read',
    summary: 'Why routine antenatal checkups matter, essential screenings schedule, and a structured question checklist for your doctor.',
    fullContent: `Antenatal care (ANC) is the cornerstone of safe pregnancy, monitoring both maternal health and fetal developmental milestones.

### Recommended Routine Screenings:
1. First Trimester (Dating Scan & Baseline Labs): Confirms intrauterine pregnancy, gestational age, blood group/Rh factor, complete blood count (CBC for anemia), and infectious disease screenings.
2. Second Trimester (TIFFA / Anomaly Ultrasound): Performed around weeks 18–22 to evaluate anatomical development, placental location, and amniotic fluid volume. Oral Glucose Tolerance Test (OGTT) around weeks 24–28 screens for Gestational Diabetes.
3. Third Trimester (Growth & Blood Pressure Monitoring): Regular blood pressure checks, urine protein assessments, and fetal growth monitoring to detect pre-eclampsia and intrauterine growth restriction early.

### Questions to Ask Your Doctor at Each Visit:
- "Is my blood pressure and weight progression within the expected range for my gestational age?"
- "What vaccines (such as Tdap / Tetanus Toxoid and seasonal Influenza) are recommended at this stage?"
- "Are the physical sensations I am experiencing (cramping, discharge, swelling) normal?"
- "What emergency contact number or hospital triage should I reach if I experience sudden symptoms after hours?"`,
    sources: [
      'WHO — WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience',
      'MoHFW Govt. of India — Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) Protocols'
    ]
  },

  // --- 4. PREGNANCY NUTRITION & SUPPLEMENTS ---
  {
    id: 'art-p4',
    title: 'Pregnancy Nutrition, Safe Hydration & Essential Supplements',
    category: 'pregnancy',
    topic: 'Nutrition & Supplements',
    readTime: '5 min read',
    summary: 'Evidence-based guidance on essential micronutrients, daily hydration goals, and discussing supplements with your obstetrician.',
    fullContent: `Nutritional requirements increase during pregnancy to support fetal growth and maternal tissue expansion.

### Core Nutritional Priorities:
1. Folic Acid / Folate (400–600 mcg daily): Critical in the pre-conception period and first trimester to prevent Neural Tube Defects (such as spina bifida).
2. Elemental Iron (27–30 mg daily): Essential for producing hemoglobin to supply oxygen to the fetus and placenta, preventing maternal anemia.
3. Calcium (1,000 mg daily) & Vitamin D: Crucial for fetal bone and tooth development. If dietary intake is insufficient, calcium is mobilized from maternal bones.
4. Omega-3 Fatty Acids (DHA/EPA): Supports fetal brain and visual development.
5. Dietary Protein: Aim for 70–100g daily from lentils, beans, tofu, eggs, pasteurized dairy, or lean poultry.

### Safe Hydration Guidelines:
- Drink 2.5 to 3 liters (8–10 large glasses) of clean, filtered water daily.
- Adequate hydration supports amniotic fluid levels, aids digestion, and reduces the risk of urinary tract infections (UTIs) and constipation.

### Strict Medical Advisory:
Never start high-dose vitamins (particularly Vitamin A, which can cause teratogenic harm at excessive levels) or unverified botanical supplements without explicit approval and prescription from your treating obstetrician.`,
    sources: [
      'WHO — Guideline: Daily Iron and Folic Acid Supplementation in Pregnant Women',
      'Indian Council of Medical Research (ICMR-NIN) — Dietary Guidelines for Indians',
      'CDC — Pregnancy Nutrition and Daily Supplements'
    ]
  },

  // --- 5. FOODS TO LIMIT OR AVOID ---
  {
    id: 'art-p5',
    title: 'Foods and Substances to Limit or Avoid During Pregnancy',
    category: 'pregnancy',
    topic: 'Food Safety',
    readTime: '4 min read',
    summary: 'Key food safety principles to avoid foodborne pathogens like Listeria and Toxoplasma, and substances that pose fetal risks.',
    fullContent: `During pregnancy, mild alterations in maternal immune function increase vulnerability to certain foodborne bacterial and parasitic infections.

### Foods to Strictly Avoid:
1. Raw or Undercooked Meat, Poultry & Eggs: Poses risks of Salmonella and Toxoplasma gondii, which can cause severe fetal infection.
2. Unpasteurized Milk, Juices & Soft Cheeses: Raw dairy (like unpasteurized brie, camembert, or feta) may harbor Listeria monocytogenes, a bacterium capable of crossing the placenta.
3. High-Mercury Predatory Fish: Avoid shark, swordfish, king mackerel, and tilefish. Opt instead for low-mercury fish like salmon, sardines, or anchovies in moderation.
4. Raw Sprouts: Raw alfalfa, clover, or mung bean sprouts can harbor bacteria in warm growing conditions; consume only thoroughly cooked sprouts.
5. Unwashed Raw Produce: Always wash all fruits and vegetables under running water to remove soil residues and potential parasites.

### Substances to Limit or Eliminate:
- Caffeine: Limit total caffeine from all sources (coffee, tea, cola, chocolate) to less than 200 mg per day (approximately one 12 oz brewed coffee).
- Alcohol: There is no known safe level of alcohol consumption during pregnancy; complete abstinence is recommended to prevent Fetal Alcohol Spectrum Disorders (FASD).
- Tobacco & Nicotine: Nicotine restricts oxygen and nutrient flow through the placenta, significantly increasing risks of low birth weight and preterm delivery.`,
    sources: [
      'US CDC — Food Safety for Pregnant Women',
      'National Health Service (NHS UK) — Foods to Avoid in Pregnancy',
      'Food Safety and Standards Authority of India (FSSAI) — Safe Food Guidance for Mothers'
    ]
  },

  // --- 6. BABY CARE & POSTPARTUM RECOVERY ---
  {
    id: 'art-p6',
    title: 'Postpartum Recovery Essentials & Newborn Care Basics',
    category: 'postpartum',
    topic: 'Postpartum & Baby',
    readTime: '5 min read',
    summary: 'What to expect during the "fourth trimester": physical healing, lochia, pelvic floor care, and the ABCs of safe newborn sleep.',
    fullContent: `The postpartum period (often called the fourth trimester) represents a profound physical and hormonal transition for new parents.

### Maternal Physical Recovery:
1. Lochia (Postpartum Bleeding): Vaginal discharge containing blood and uterine tissue that transitions from bright red (lochia rubra) to brownish-pink and yellowish-white over 2 to 6 weeks.
2. Perineal & Pelvic Floor Care: Use warm sitz baths, cooling witch hazel pads, and gentle perineal wash bottles after urination. Avoid lifting heavy objects during early healing.
3. Cesarean Incision Care: Keep surgical incisions clean and dry. Watch for signs of infection (increased redness, warmth, discharge, or fever).
4. After-Pains: Mild uterine contractions while nursing are normal as oxytocin helps shrink the uterus back to its pre-pregnancy size.

### Newborn Care Fundamentals:
- The ABCs of Safe Sleep:
  - A (Alone): In their own crib or bassinet without loose blankets, pillows, bumpers, or toys.
  - B (on their Back): Always place infants on their back for every sleep to minimize Sudden Infant Death Syndrome (SIDS) risk.
  - C (in a Clear Crib): On a firm, flat, fitted mattress.
- Umbilical Cord Care: Keep the cord stump clean and dry exposed to air until it falls off naturally (typically within 7–14 days).
- Feeding on Cue: Newborns feed 8–12 times in 24 hours. Look for early hunger cues (rooting, lip smacking, hands to mouth) before crying starts.`,
    sources: [
      'WHO — WHO Recommendations on Maternal and Newborn Postnatal Care',
      'American Academy of Pediatrics (AAP) — Sleep-Related Infant Deaths: Updated Guidelines',
      'MoHFW India — Navjaat Shishu Suraksha Karyakram (NSSK) Newborn Care'
    ]
  },

  // --- 7. EMOTIONAL WELLBEING & PPD ---
  {
    id: 'art-p7',
    title: 'Perinatal & Postpartum Emotional Wellbeing: Baby Blues vs. PPD',
    category: 'postpartum',
    topic: 'Mental Health',
    readTime: '4 min read',
    summary: 'Understanding postpartum hormonal shifts, distinguishing temporary baby blues from postpartum depression (PPD), and accessing support.',
    fullContent: `Mental health is an integral part of maternal and family wellness. Following childbirth, a precipitous drop in estrogen and progesterone combined with sleep deprivation can deeply impact mood.

### Baby Blues vs. Postpartum Depression (PPD):
- "Baby Blues" (Occurs in ~70–80% of new mothers):
  - Mild mood swings, tearfulness, irritability, and anxiety.
  - Begins within 2–4 days after birth and resolves spontaneously within 10–14 days with rest and support.
- Postpartum Depression & Anxiety (Occurs in ~15–20% of new mothers):
  - Symptoms persist beyond 2 weeks or worsen over time.
  - Signs: Pervasive sadness, intense guilt or feeling inadequate as a mother, severe anxiety/panic attacks, difficulty bonding with the baby, or intrusive thoughts.

### Steps for Support:
1. Speak Openly: Share feelings with your partner, family, or trusted friends. PPD is a common, highly treatable medical condition, not a personal failing.
2. Professional Care: Consult your obstetrician, pediatrician, or mental health professional. Evidence-based therapies and lactation-safe medications are available.
3. Verified Helplines:
   - India: Tele-MANAS (14416 / 1800-891-4416) & KIRAN Mental Health Helpline (1800-599-0019) provide free 24/7 confidential psychological support.`,
    sources: [
      'WHO — Maternal Mental Health and Wellbeing',
      'Postpartum Support International (PSI) — Perinatal Mood Disorders',
      'Ministry of Health and Family Welfare (MoHFW), Govt. of India — Tele-MANAS Initiative'
    ]
  },

  // --- 8. PREGNANCY WARNING SIGNS ---
  {
    id: 'art-p8',
    title: 'Urgent Pregnancy Warning Signs: When to Seek Immediate Care',
    category: 'pregnancy',
    topic: 'Emergency Awareness',
    readTime: '3 min read',
    summary: 'Critical red-flag symptoms that require immediate evaluation at a hospital emergency or labor triage department.',
    fullContent: `While most pregnancy symptoms are benign adaptations, certain acute signs warrant immediate medical assessment to protect mother and baby.

### Red-Flag Symptoms Requiring Immediate Emergency Evaluation:
1. Any Vaginal Bleeding or Fluid Leakage: Fresh bright red bleeding, with or without pain, or a continuous gush/trickle of clear watery fluid before 37 weeks.
2. Severe Abdominal or Pelvic Pain: Sharp, unremitting, or cramping pain that does not ease with rest.
3. Symptoms of Pre-Eclampsia (High Blood Pressure Complication):
   - Severe, persistent headache that does not improve with acetaminophen.
   - Visual disturbances: Blurred vision, flashing spots, or light sensitivity.
   - Sudden, severe swelling in the face, hands, or around the eyes.
   - Sharp pain in the upper right abdomen (under the ribs).
4. High Fever with Chills (Temperature > 38°C / 100.4°F): May indicate amniotic or systemic infection.
5. Significant Decrease in Fetal Movements: In the third trimester (after 28 weeks), if your baby moves noticeably less than their established active pattern.
6. Persistent Severe Vomiting with Inability to Retain Fluids: Risk of dehydration and electrolyte imbalance (Hyperemesis Gravidarum).

### Immediate Action Protocol:
Do not wait for your next scheduled antenatal clinic appointment. Contact your obstetrician, emergency ambulance (112 / 108 in India), or proceed directly to the nearest maternity hospital emergency room.`,
    sources: [
      'WHO — Standards for Improving Quality of Maternal and Newborn Care in Health Facilities',
      'American College of Obstetricians and Gynecologists (ACOG) — Warning Signs in Pregnancy',
      'MoHFW India — Emergency Obstetric Care Protocols'
    ]
  },

  // --- 9. MENSTRUAL HYGIENE & PCOS (Phase 1 Baseline Preserved) ---
  {
    id: 'art-m1',
    title: 'Decoding PCOS vs PCOD: Clinical Insights & Lifestyle Strategies',
    category: 'menstrual',
    topic: 'Hormonal Health',
    readTime: '4 min read',
    summary: 'Understanding diagnostic criteria, insulin resistance links, and evidence-based lifestyle management.',
    fullContent: `Polycystic Ovary Syndrome (PCOS) is a complex endocrine disorder affecting reproductive-aged women, characterized by irregular periods, hyperandrogenism (excess androgens), and polycystic ovarian morphology.

Key Evidence-Based Strategies:
1. Low Glycemic Nutrition: Fiber-rich whole grains, leafy greens, and lean proteins help stabilize insulin levels and androgen spikes.
2. Progressive Movement: Consistent resistance training combined with daily walking significantly improves insulin sensitivity.
3. Sleep & Stress Hygiene: Consistent 7–8 hour sleep cycles help regulate cortisol, supporting reproductive hormone balance.`,
    sources: [
      'Endocrine Society — Clinical Practice Guidelines on PCOS',
      'Indian Council of Medical Research (ICMR) — PCOS Guidelines for Indian Women'
    ]
  },
  {
    id: 'art-m2',
    title: 'Menstrual Hygiene Best Practices: Pads, Cups & Toxic Shock Safety',
    category: 'menstrual',
    topic: 'Hygiene & Safety',
    readTime: '3 min read',
    summary: 'Optimal change frequencies, cup sterilization, and preventing bacterial infections during menstruation.',
    fullContent: `Proper menstrual hygiene practices protect the vaginal microbiome and prevent bacterial vaginosis and urinary tract infections.

Key Guidelines:
1. Sanitary Pads: Change every 4–6 hours regardless of flow lightness to prevent microbial buildup.
2. Menstrual Cups: Sterilize in boiling water for 5–7 minutes between cycles. Empty and rinse every 8–12 hours.
3. Intimate Cleansing: Cleanse external vulvar skin with plain warm water. Avoid internal vaginal douching, which disrupts natural acidic pH flora.`,
    sources: [
      'WHO — Menstrual Health and Hygiene Guidelines',
      'CDC — Hygiene and Menstrual Product Safety'
    ]
  }
];
