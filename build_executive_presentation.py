import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# ---------------------------------------------------------
# CONSTANTS & COLOR PALETTE
# ---------------------------------------------------------
COLOR_DEEP_NAVY = RGBColor(10, 25, 47)       # #0A192F
COLOR_PRIMARY_BLUE = RGBColor(0, 97, 148)    # #006194
COLOR_TEAL = RGBColor(0, 103, 129)           # #006781
COLOR_EMERALD = RGBColor(0, 105, 72)         # #006948 (AYUSH)
COLOR_CRIMSON = RGBColor(186, 26, 26)        # #BA1A1A (Red-flag)
COLOR_AMBER = RGBColor(217, 119, 6)          # #D97706
COLOR_BG_ICE = RGBColor(245, 248, 255)       # #F5F8FF
COLOR_WHITE = RGBColor(255, 255, 255)
COLOR_TEXT_MAIN = RGBColor(19, 27, 46)       # #131B2E
COLOR_TEXT_MUTED = RGBColor(100, 116, 139)   # #64748B
COLOR_CARD_BORDER = RGBColor(218, 226, 253)  # #DAE2FD
COLOR_ACCENT_BG = RGBColor(224, 242, 254)    # #E0F2FE

FONT_TITLE = 'Plus Jakarta Sans'
FONT_BODY = 'Inter'

def create_deck():
    prs = Presentation()
    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    def set_slide_bg(slide, color=COLOR_BG_ICE):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, category, title, subtitle):
        # Category Badge Pill
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.45), Inches(3.2), Inches(0.38))
        badge.fill.solid()
        badge.fill.fore_color.rgb = COLOR_ACCENT_BG
        badge.line.color.rgb = COLOR_PRIMARY_BLUE
        badge.line.width = Pt(1)
        tf_b = badge.text_frame
        tf_b.word_wrap = True
        tf_b.margin_left = tf_b.margin_right = tf_b.margin_top = tf_b.margin_bottom = 0
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        run_b = p_b.add_run()
        run_b.text = category.upper()
        run_b.font.name = FONT_TITLE
        run_b.font.size = Pt(11)
        run_b.font.bold = True
        run_b.font.color.rgb = COLOR_PRIMARY_BLUE

        # Title & Subtitle Box
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.88), Inches(11.733), Inches(0.95))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p_t = tf.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.name = FONT_TITLE
        r_t.font.size = Pt(22)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_TEXT_MAIN

        p_s = tf.add_paragraph()
        p_s.space_before = Pt(3)
        r_s = p_s.add_run()
        r_s.text = subtitle
        r_s.font.name = FONT_BODY
        r_s.font.size = Pt(13)
        r_s.font.color.rgb = COLOR_TEXT_MUTED

    def add_footer(slide, slide_num, total=12):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.4))
        tf = footer_box.text_frame
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        r1 = p.add_run()
        r1.text = "Smart India Hackathon 2026 • Problem Statement SIH26047 • Team Allied"
        r1.font.name = FONT_BODY
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = COLOR_TEXT_MUTED

        r2 = p.add_run()
        r2.text = f"                                                                                                   Slide {slide_num} of {total}"
        r2.font.name = FONT_BODY
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = COLOR_TEXT_MUTED

    def add_card(slide, left, top, width, height, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER, border_width=1):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(border_width)
        else:
            card.line.fill.background()
        return card

    # =========================================================================
    # SLIDE 1: TITLE / COVER (HIGH-IMPACT DARK EXECUTIVE HERO)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s1, COLOR_DEEP_NAVY)

    # Accent glow top right
    accent_box = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.4), Inches(7.5))
    accent_box.fill.solid()
    accent_box.fill.fore_color.rgb = COLOR_PRIMARY_BLUE
    accent_box.line.fill.background()

    # Title Container
    title_tb = s1.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(11.0), Inches(3.2))
    tf1 = title_tb.text_frame
    tf1.word_wrap = True

    p_badge = tf1.paragraphs[0]
    r_badge = p_badge.add_run()
    r_badge.text = "SMART INDIA HACKATHON 2026 • PROBLEM STATEMENT ID: SIH26047"
    r_badge.font.name = FONT_TITLE
    r_badge.font.size = Pt(12)
    r_badge.font.bold = True
    r_badge.font.color.rgb = RGBColor(147, 204, 255) # light blue

    p_title = tf1.add_paragraph()
    p_title.space_before = Pt(14)
    r_t = p_title.add_run()
    r_t.text = "MediKiosk: AI-Powered Digital Clinical Intake & Triage Platform"
    r_t.font.name = FONT_TITLE
    r_t.font.size = Pt(36)
    r_t.font.bold = True
    r_t.font.color.rgb = COLOR_WHITE

    p_sub = tf1.add_paragraph()
    p_sub.space_before = Pt(14)
    r_sub = p_sub.add_run()
    r_sub.text = "Bridging India's 2-Minute OPD Bottleneck with Native Dual-Stream (Allopathy + AYUSH) Automated Intake, Vision OCR & ABDM FHIR Compliance"
    r_sub.font.name = FONT_BODY
    r_sub.font.size = Pt(17)
    r_sub.font.color.rgb = RGBColor(203, 213, 225)

    # 4 Meta Badges at Bottom
    meta_cards = [
        ("THEME", "MedTech / HealthTech", COLOR_PRIMARY_BLUE),
        ("PS CATEGORY", "Software (Kiosk/AI)", COLOR_TEAL),
        ("TEAM", "Allied (SIH2026)", COLOR_EMERALD),
        ("DEVELOPMENT STATUS", "100% Functional App Live", RGBColor(16, 149, 193))
    ]

    for idx, (label, val, accent) in enumerate(meta_cards):
        c_left = Inches(1.2 + idx * 2.8)
        card = add_card(s1, c_left, Inches(4.8), Inches(2.6), Inches(1.5), bg_color=RGBColor(19, 38, 68), border_color=accent, border_width=1.5)
        tb = s1.shapes.add_textbox(c_left, Inches(4.8), Inches(2.6), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.18)
        
        p0 = tf.paragraphs[0]
        r0 = p0.add_run()
        r0.text = label
        r0.font.name = FONT_TITLE
        r0.font.size = Pt(10)
        r0.font.bold = True
        r0.font.color.rgb = accent

        p1 = tf.add_paragraph()
        p1.space_before = Pt(6)
        r1 = p1.add_run()
        r1.text = val
        r1.font.name = FONT_TITLE
        r1.font.size = Pt(13)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_WHITE

    # =========================================================================
    # SLIDE 2: THE HEALTHCARE CRISIS (PROBLEM CONTEXT & BOTTLENECK)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s2)
    add_header(s2, "Problem Validation", "The OPD Crisis: India's 2-Minute Diagnostic Bottleneck", "Tertiary hospitals face 4,000–10,000 daily patients where consultation duration limits clinical safety.")
    add_footer(s2, 2)

    # 3 Stat Cards on Left
    stats = [
        ("2.0 min", "Average Indian OPD Consult", "BMJ Open (2017) study of 67 nations showed Indian consultations are among the world's shortest."),
        ("70-80%", "Diagnosis Driven by History", "Diagnostic accuracy relies on thorough history-taking, yet doctors spend most time typing notes."),
        ("4k-10k", "Daily OPD Footfall / Hospital", "Severe overcrowding in government hospital foyers causes chaotic queues and patient distress.")
    ]

    for idx, (num, title, desc) in enumerate(stats):
        top_pos = Inches(2.0 + idx * 1.55)
        add_card(s2, Inches(0.8), top_pos, Inches(3.6), Inches(1.4), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER)
        
        tb = s2.shapes.add_textbox(Inches(0.95), top_pos, Inches(3.3), Inches(1.4))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.12)
        
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = num
        r.font.name = FONT_TITLE
        r.font.size = Pt(24)
        r.font.bold = True
        r.font.color.rgb = COLOR_PRIMARY_BLUE if idx != 0 else COLOR_CRIMSON

        p_t = tf.add_paragraph()
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.name = FONT_TITLE
        r_t.font.size = Pt(11)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_TEXT_MAIN

        p_d = tf.add_paragraph()
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = COLOR_TEXT_MUTED

    # 3 Failure Pillars on Right
    pillars = [
        ("1. Overburdened Medical Officers", "Physicians spend 60% of their 2-minute slot repeatedly asking basic demographic and symptom questions or typing into legacy systems, leading to severe diagnostic burnout and lost examination time."),
        ("2. The Scattered Paper Record Trail", "Patients carry wrinkled plastic bags of previous paper prescriptions, lab slips, and discharge summaries. Doctors cannot review 5 years of paper records in 60 seconds, causing redundant lab re-tests."),
        ("3. Digital Divide & Low Literacy Exclusion", "Elderly, rural, and illiterate citizens cannot navigate complex smartphone apps or web portals. Over 40% of public hospital attendees require accompanied family assistance for registration.")
    ]

    for idx, (title, body) in enumerate(pillars):
        top_pos = Inches(2.0 + idx * 1.55)
        add_card(s2, Inches(4.7), top_pos, Inches(7.8), Inches(1.4), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER)
        
        tb = s2.shapes.add_textbox(Inches(4.9), top_pos, Inches(7.4), Inches(1.4))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.15)

        p_title = tf.paragraphs[0]
        r_t = p_title.add_run()
        r_t.text = title
        r_t.font.name = FONT_TITLE
        r_t.font.size = Pt(13)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_PRIMARY_BLUE

        p_body = tf.add_paragraph()
        p_body.space_before = Pt(4)
        r_b = p_body.add_run()
        r_b.text = body
        r_b.font.name = FONT_BODY
        r_b.font.size = Pt(10.5)
        r_b.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 3: THE SOLUTION (INTRODUCING MEDIKIOSK)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s3)
    add_header(s3, "Proposed Innovation", "MediKiosk: Transforming Hospital Foyers into Clinical Gateways", "A self-service, tactile pre-consultation kiosk generating physician-ready clinical summaries before doctor entry.")
    add_footer(s3, 3)

    # 4 Solution Pillars (Cards)
    cards_s3 = [
        ("Zero-Training Tactile Interface", 
         "Oversized 72px touch targets, bilingual audio prompts, and browser-native Web Speech API empower elderly and rural patients to register and converse without prior digital literacy.", 
         COLOR_PRIMARY_BLUE),
        ("Dual-Stream Clinical Intelligence", 
         "World-first intake platform supporting both modern Allopathic (SOCRATES) inquiry and classical Ayurvedic (Dashavidha Pariksha) constitutional triage.", 
         COLOR_EMERALD),
        ("Vision OCR Paper Digitization", 
         "Instant client-side Tesseract.js OCR scans previous prescription slips and lab papers right in the kiosk viewfinder, extracting active drugs without cloud vision APIs.", 
         COLOR_TEAL),
        ("Doctor-in-the-Loop Governance", 
         "Never delivers an unsupervised autonomous diagnosis. Produces an editable draft EHR summary for the physician, preserving 100% clinical authority and zero legal liability.", 
         COLOR_DEEP_NAVY)
    ]

    for idx, (title, desc, color) in enumerate(cards_s3):
        col = idx % 2
        row = idx // 2
        c_left = Inches(0.8 + col * 6.0)
        c_top = Inches(2.0 + row * 2.35)

        add_card(s3, c_left, c_top, Inches(5.7), Inches(2.15), bg_color=COLOR_WHITE, border_color=color, border_width=1.5)
        
        # Color bar indicator on top of card
        bar = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_left, c_top, Inches(5.7), Inches(0.1))
        bar.fill.solid()
        bar.fill.fore_color.rgb = color
        bar.line.fill.background()

        tb = s3.shapes.add_textbox(c_left + Inches(0.25), c_top + Inches(0.2), Inches(5.2), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = title
        r.font.name = FONT_TITLE
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = color

        p_d = tf.add_paragraph()
        p_d.space_before = Pt(8)
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 4: THE 5-STEP PATIENT JOURNEY FLOW
    # =========================================================================
    s4 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s4)
    add_header(s4, "Operational Flow", "The 5-Step Patient Journey: Seamless Kiosk-to-Consult Pipeline", "Designed for rapid 90-second intake in busy public hospital outpatient foyers.")
    add_footer(s4, 4)

    steps = [
        ("Step 1: IDENTIFY", "ABHA & Guest Check-In", "14-digit ABHA entry with on-screen numeric keypad or QR scan. Instant 1-tap 'Guest Skip' for patients without IDs.", COLOR_PRIMARY_BLUE),
        ("Step 2: CONVERSE", "Voice/Touch Triage", "Speaks or taps answers. Gemini AI asks 3 structured follow-up questions in preferred language (SOCRATES or AYUSH).", COLOR_TEAL),
        ("Step 3: SCAN", "Vision OCR Capture", "Place old prescription slip in camera viewfinder. Client-side Tesseract.js extracts prior medications and dosages.", COLOR_PRIMARY_BLUE),
        ("Step 4: SUMMARIZE", "Clinical Synthesis & Token", "AI synthesizes full transcript + OCR into structured draft EHR. Physical/digital Token issued with OPD room assignment.", COLOR_EMERALD),
        ("Step 5: CONSULT", "Physician Review", "Doctor opens pre-structured summary in Room 12. Validates findings in 20 seconds, shifts time to physical exam.", COLOR_DEEP_NAVY)
    ]

    for idx, (s_title, s_head, s_desc, s_color) in enumerate(steps):
        c_left = Inches(0.8 + idx * 2.4)
        c_top = Inches(2.0)
        c_width = Inches(2.25)
        c_height = Inches(4.6)

        add_card(s4, c_left, c_top, c_width, c_height, bg_color=COLOR_WHITE, border_color=s_color, border_width=1.5)

        # Number circle
        num_circle = s4.shapes.add_shape(MSO_SHAPE.OVAL, c_left + Inches(0.2), c_top + Inches(0.25), Inches(0.7), Inches(0.7))
        num_circle.fill.solid()
        num_circle.fill.fore_color.rgb = s_color
        num_circle.line.fill.background()
        tf_nc = num_circle.text_frame
        p_nc = tf_nc.paragraphs[0]
        p_nc.alignment = PP_ALIGN.CENTER
        r_nc = p_nc.add_run()
        r_nc.text = str(idx + 1)
        r_nc.font.name = FONT_TITLE
        r_nc.font.size = Pt(16)
        r_nc.font.bold = True
        r_nc.font.color.rgb = COLOR_WHITE

        # Text box
        tb = s4.shapes.add_textbox(c_left + Inches(0.15), c_top + Inches(1.15), Inches(1.95), Inches(3.2))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p1 = tf.paragraphs[0]
        r1 = p1.add_run()
        r1.text = s_title
        r1.font.name = FONT_TITLE
        r1.font.size = Pt(10)
        r1.font.bold = True
        r1.font.color.rgb = s_color

        p2 = tf.add_paragraph()
        p2.space_before = Pt(4)
        r2 = p2.add_run()
        r2.text = s_head
        r2.font.name = FONT_TITLE
        r2.font.size = Pt(12)
        r2.font.bold = True
        r2.font.color.rgb = COLOR_TEXT_MAIN

        p3 = tf.add_paragraph()
        p3.space_before = Pt(8)
        r3 = p3.add_run()
        r3.text = s_desc
        r3.font.name = FONT_BODY
        r3.font.size = Pt(10)
        r3.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 5: CLINICAL CONVERSATIONAL ENGINE (SOCRATES + GEMINI)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s5)
    add_header(s5, "Clinical Engine", "Conversational AI: Rigorous Medical Inquiry via SOCRATES", "Adaptive clinical questioning built on Google Gemini 2.0 Flash with zero hallucination constraints.")
    add_footer(s5, 5)

    # Left: The SOCRATES Protocol Box
    add_card(s5, Inches(0.8), Inches(2.0), Inches(5.7), Inches(4.6), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER)
    tb_soc = s5.shapes.add_textbox(Inches(1.05), Inches(2.2), Inches(5.2), Inches(4.2))
    tf_soc = tb_soc.text_frame
    tf_soc.word_wrap = True
    tf_soc.margin_left = tf_soc.margin_right = tf_soc.margin_top = tf_soc.margin_bottom = 0

    p = tf_soc.paragraphs[0]
    r = p.add_run()
    r.text = "The Evidence-Based SOCRATES Framework"
    r.font.name = FONT_TITLE
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = COLOR_PRIMARY_BLUE

    soc_items = [
        ("S - Site", "Where exactly is the pain or discomfort located?"),
        ("O - Onset", "When did it start? Was it sudden, acute, or gradual?"),
        ("C - Character", "What does it feel like? (Burning, aching, sharp, dull)"),
        ("R - Radiation", "Does the sensation radiate to arms, back, or jaw?"),
        ("A - Associations", "Any fever, nausea, vomiting, dizziness, or sweat?"),
        ("T - Timing", "Is it constant or intermittent? Worse morning or night?"),
        ("E - Exacerbating", "What makes it better or worse? (Rest, movement, food)"),
        ("S - Severity", "How severe on a scale of 1-10? Does it impede work?")
    ]

    for k, d in soc_items:
        p_i = tf_soc.add_paragraph()
        p_i.space_before = Pt(4)
        r_k = p_i.add_run()
        r_k.text = f"{k}: "
        r_k.font.name = FONT_TITLE
        r_k.font.size = Pt(10)
        r_k.font.bold = True
        r_k.font.color.rgb = COLOR_TEXT_MAIN

        r_d = p_i.add_run()
        r_d.text = d
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(10)
        r_d.font.color.rgb = COLOR_TEXT_MUTED

    # Right Top: Gemini 2.0 Flash Specs
    add_card(s5, Inches(6.8), Inches(2.0), Inches(5.7), Inches(2.15), bg_color=COLOR_WHITE, border_color=COLOR_TEAL, border_width=1.5)
    tb_gem = s5.shapes.add_textbox(Inches(7.05), Inches(2.15), Inches(5.2), Inches(1.8))
    tf_gem = tb_gem.text_frame
    tf_gem.word_wrap = True
    tf_gem.margin_left = tf_gem.margin_right = tf_gem.margin_top = tf_gem.margin_bottom = 0

    p_g = tf_gem.paragraphs[0]
    r_g = p_g.add_run()
    r_g.text = "Google Gemini 2.0 Flash Integration"
    r_g.font.name = FONT_TITLE
    r_g.font.size = Pt(14)
    r_g.font.bold = True
    r_g.font.color.rgb = COLOR_TEAL

    p_gd = tf_gem.add_paragraph()
    p_gd.space_before = Pt(6)
    r_gd = p_gd.add_run()
    r_gd.text = "• Sub-800ms Latency: Ultra-fast generation of the next structured follow-up question.\n• Strict JSON Output: Returns structured question text + exactly 3 touch options with icons.\n• Free-Tier Accessibility: Runs on zero API cost tier, ideal for public hospital scale.\n• Zero Medical Hallucination: Guardrailed prompt strictly restricts inquiry to symptom boundaries."
    r_gd.font.name = FONT_BODY
    r_gd.font.size = Pt(10)
    r_gd.font.color.rgb = COLOR_TEXT_MAIN

    # Right Bottom: Clinical Heuristic Offline Fallback
    add_card(s5, Inches(6.8), Inches(4.45), Inches(5.7), Inches(2.15), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER)
    tb_fb = s5.shapes.add_textbox(Inches(7.05), Inches(4.6), Inches(5.2), Inches(1.8))
    tf_fb = tb_fb.text_frame
    tf_fb.word_wrap = True
    tf_fb.margin_left = tf_fb.margin_right = tf_fb.margin_top = tf_fb.margin_bottom = 0

    p_f = tf_fb.paragraphs[0]
    r_f = p_f.add_run()
    r_f.text = "100% Offline Clinical Heuristic Fallback"
    r_f.font.name = FONT_TITLE
    r_f.font.size = Pt(14)
    r_f.font.bold = True
    r_f.font.color.rgb = COLOR_PRIMARY_BLUE

    p_fd = tf_fb.add_paragraph()
    p_fd.space_before = Pt(6)
    r_fd = p_fd.add_run()
    r_fd.text = "• Fail-Safe Resilience: If hospital internet drops or API quota is hit, MediKiosk instantly switches to its built-in rule-based decision tree.\n• Deterministic Symptom Mapping: Guaranteed question progression across Duration, Associated Signs, and Severity without ever freezing or crashing.\n• 100% Kiosk Uptime: Essential for high-stress, unpredictable rural hospital infrastructure."
    r_fd.font.name = FONT_BODY
    r_fd.font.size = Pt(10)
    r_fd.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 6: AYUSH INNOVATION (DASHAVIDHA PARIKSHA)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s6)
    add_header(s6, "Core Differentiator", "AYUSH Innovation: Native Dashavidha Pariksha Intake", "The first clinical intake tool in India to operationalize classical Ayurvedic examination at the triage stage.")
    add_footer(s6, 6)

    # 3 Cards for AYUSH
    ayush_cards = [
        ("Prakriti & Vikriti Analysis", 
         "Assesses elemental Dosha equilibrium (Vata, Pitta, Kapha) based on Charaka Samhita (Vimana Sthana 8/94).\n\n• Vata: Cold & dry weather sensitivity, joint stiffness, restless sleep.\n• Pitta: Hot & humid discomfort, burning hunger (Tikshna Agni), acid reflux.\n• Kapha: Cold/damp congestion, lethargy, deep sleep, slow metabolism.", 
         COLOR_EMERALD),
        ("Agni & Dhatu Examination", 
         "Systematic assessment of digestive capacity and tissue strength vital for holistic Ayurvedic prescribing.\n\n• Vishama Agni: Irregular appetite with bloating and flatulence (Vata).\n• Tikshna Agni: Intense thirst and hyperacidity (Pitta).\n• Manda Agni: Heaviness after minimal food intake (Kapha).\n• Sama Agni: Balanced digestion.", 
         COLOR_TEAL),
        ("Alignment with Ministry of AYUSH", 
         "Supports India's National AYUSH Mission and integrated hospital mandates (AIIMS, CCRAS, AYUSH OPDs).\n\n• Pre-Classified Dossier: Ayurvedic Vaidyas receive patient dosha profiles before consultation.\n• Bridges Traditional & Modern: Standardizes Ayurvedic intake records for ABDM digital health lockers.\n• Saves 70% of Vaidya Intake Time.", 
         COLOR_PRIMARY_BLUE)
    ]

    for idx, (title, desc, color) in enumerate(ayush_cards):
        c_left = Inches(0.8 + idx * 4.0)
        c_top = Inches(2.0)
        c_width = Inches(3.75)
        c_height = Inches(4.6)

        add_card(s6, c_left, c_top, c_width, c_height, bg_color=COLOR_WHITE, border_color=color, border_width=1.5)

        # Header tag
        tag = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_left, c_top, c_width, Inches(0.45))
        tag.fill.solid()
        tag.fill.fore_color.rgb = color
        tag.line.fill.background()
        tf_tag = tag.text_frame
        p_tag = tf_tag.paragraphs[0]
        p_tag.alignment = PP_ALIGN.CENTER
        r_tag = p_tag.add_run()
        r_tag.text = title.upper()
        r_tag.font.name = FONT_TITLE
        r_tag.font.size = Pt(10)
        r_tag.font.bold = True
        r_tag.font.color.rgb = COLOR_WHITE

        # Body
        tb = s6.shapes.add_textbox(c_left + Inches(0.2), c_top + Inches(0.6), Inches(3.35), Inches(3.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = desc
        r.font.name = FONT_BODY
        r.font.size = Pt(10.5)
        r.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 7: DETERMINISTIC RED-FLAG EMERGENCY TRIAGE
    # =========================================================================
    s7 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s7)
    add_header(s7, "Patient Safety Protocol", "Deterministic Red-Flag Detection: 0ms Emergency Intercept", "Zero-latency local safety net routing acute medical emergencies directly to bedside triage.")
    add_footer(s7, 7)

    # Left: The 4 Red Flag Categories
    add_card(s7, Inches(0.8), Inches(2.0), Inches(5.7), Inches(4.6), bg_color=COLOR_WHITE, border_color=COLOR_CRIMSON, border_width=1.5)
    tb_rf = s7.shapes.add_textbox(Inches(1.05), Inches(2.2), Inches(5.2), Inches(4.2))
    tf_rf = tb_rf.text_frame
    tf_rf.word_wrap = True
    tf_rf.margin_left = tf_rf.margin_right = tf_rf.margin_top = tf_rf.margin_bottom = 0

    p_rf = tf_rf.paragraphs[0]
    r_rf = p_rf.add_run()
    r_rf.text = "Four Critical Clinical Red Flags Detected"
    r_rf.font.name = FONT_TITLE
    r_rf.font.size = Pt(15)
    r_rf.font.bold = True
    r_rf.font.color.rgb = COLOR_CRIMSON

    rf_rules = [
        ("1. Acute Cardiac / Chest Pain", "Keywords: 'chest pain', 'chest tightness', 'crushing chest', 'सीने में दर्द'\nProtocol: Intercepts suspect ACS / Myocardial Infarction immediately."),
        ("2. Severe Respiratory Distress", "Keywords: 'breathing difficulty', 'shortness of breath', 'choking', 'सांस में तकलीफ'\nProtocol: Intercepts acute asthma, COPD exacerbation, pulmonary edema."),
        ("3. Acute Hemorrhage / Bleeding", "Keywords: 'severe bleeding', 'vomiting blood', 'coughing blood', 'खून की उल्टी'\nProtocol: Intercepts GI bleed, severe trauma, active vascular injury."),
        ("4. Loss of Consciousness / Syncope", "Keywords: 'unconscious', 'fainted', 'seizure', 'convulsions', 'बेहोश हो जाना'\nProtocol: Intercepts stroke, neurological deficit, hypoglycemia shock.")
    ]

    for title, desc in rf_rules:
        p_t = tf_rf.add_paragraph()
        p_t.space_before = Pt(6)
        r_t = p_t.add_run()
        r_t.text = f"• {title}\n"
        r_t.font.name = FONT_TITLE
        r_t.font.size = Pt(10.5)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_TEXT_MAIN

        r_d = p_t.add_run()
        r_d.text = desc
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = COLOR_TEXT_MUTED

    # Right: Emergency Workflow & Why Deterministic
    add_card(s7, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.6), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER)
    tb_wf = s7.shapes.add_textbox(Inches(7.05), Inches(2.2), Inches(5.2), Inches(4.2))
    tf_wf = tb_wf.text_frame
    tf_wf.word_wrap = True
    tf_wf.margin_left = tf_wf.margin_right = tf_wf.margin_top = tf_wf.margin_bottom = 0

    p_wf = tf_wf.paragraphs[0]
    r_wf = p_wf.add_run()
    r_wf.text = "Why Deterministic Regex Beats LLM In Triage"
    r_wf.font.name = FONT_TITLE
    r_wf.font.size = Pt(15)
    r_wf.font.bold = True
    r_wf.font.color.rgb = COLOR_PRIMARY_BLUE

    wf_points = [
        ("0ms Execution Latency", "No network roundtrip to an external API. The moment a critical keyword is spoken or tapped, intercept happens locally in <1 millisecond."),
        ("Zero False-Negative Safety Guarantee", "Generative LLMs can hallucinate reassurance or attempt to troubleshoot. Regex keyword matching guarantees 100% deterministic safety gating."),
        ("Automatic Emergency Token #E-09", "Instantly assigns emergency token #E-09, completely bypassing standard queues and routing to Emergency Bed Triage."),
        ("Audible Chime & Nursing Notification", "Triggers high-frequency acoustic alert at nursing desk with screen guidance: 'A staff member has been notified. Please remain seated.'"),
        ("Strict Realism", "Eliminates fabricated fake sensor readouts; displays only authentic AI-derived triage assessment.")
    ]

    for head, body in wf_points:
        p_pt = tf_wf.add_paragraph()
        p_pt.space_before = Pt(6)
        r_h = p_pt.add_run()
        r_h.text = f"✔ {head}: "
        r_h.font.name = FONT_TITLE
        r_h.font.size = Pt(10.5)
        r_h.font.bold = True
        r_h.font.color.rgb = COLOR_PRIMARY_BLUE

        r_b = p_pt.add_run()
        r_b.text = body
        r_b.font.name = FONT_BODY
        r_b.font.size = Pt(9.5)
        r_b.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 8: VISION OCR & MULTILINGUAL ACCESSIBILITY
    # =========================================================================
    s8 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s8)
    add_header(s8, "Inclusion & Digitization", "Vision OCR & Multilingual Inclusion: Zero-Barrier Access", "Digitizing wrinkled paper prescriptions while welcoming non-English and illiterate citizens.")
    add_footer(s8, 8)

    # 2 Columns: Left = OCR; Right = Multilingual
    # Left: Vision OCR
    add_card(s8, Inches(0.8), Inches(2.0), Inches(5.7), Inches(4.6), bg_color=COLOR_WHITE, border_color=COLOR_TEAL, border_width=1.5)
    tb_ocr = s8.shapes.add_textbox(Inches(1.05), Inches(2.2), Inches(5.2), Inches(4.2))
    tf_ocr = tb_ocr.text_frame
    tf_ocr.word_wrap = True
    tf_ocr.margin_left = tf_ocr.margin_right = tf_ocr.margin_top = tf_ocr.margin_bottom = 0

    p = tf_ocr.paragraphs[0]
    r = p.add_run()
    r.text = "Client-Side Tesseract.js OCR Engine"
    r.font.name = FONT_TITLE
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = COLOR_TEAL

    ocr_points = [
        ("In-Browser Processing", "OCR executes directly on the kiosk CPU using WebAssembly. Zero patient image data is ever transmitted to commercial third-party vision clouds."),
        ("Zero Recurring API Cost", "No per-image billing (unlike Google Cloud Vision or AWS Textract). Completely free forever, saving lakhs in municipal hospital budgets."),
        ("Prescription Entity Extraction", "Detects active drug names, dosage regimens (e.g. Paracetamol 500mg TDS, Amoxicillin), and correlated prior doctor clinical notes."),
        ("Live Visual Feedback", "Animated laser sweep guide and percentage progress bar reassure patients while processing in 1.5–3.0 seconds."),
        ("Gallery / Mobile Upload Fallback", "Allows uploading lab report photographs or camera snapshots directly from gallery.")
    ]

    for h, b in ocr_points:
        p_pt = tf_ocr.add_paragraph()
        p_pt.space_before = Pt(6)
        r_h = p_pt.add_run()
        r_h.text = f"• {h}: "
        r_h.font.name = FONT_TITLE
        r_h.font.size = Pt(10.5)
        r_h.font.bold = True
        r_h.font.color.rgb = COLOR_TEXT_MAIN

        r_b = p_pt.add_run()
        r_b.text = b
        r_b.font.name = FONT_BODY
        r_b.font.size = Pt(9.5)
        r_b.font.color.rgb = COLOR_TEXT_MUTED

    # Right: Multilingual Voice & Low Literacy
    add_card(s8, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.6), bg_color=COLOR_WHITE, border_color=COLOR_PRIMARY_BLUE, border_width=1.5)
    tb_multi = s8.shapes.add_textbox(Inches(7.05), Inches(2.2), Inches(5.2), Inches(4.2))
    tf_multi = tb_multi.text_frame
    tf_multi.word_wrap = True
    tf_multi.margin_left = tf_multi.margin_right = tf_multi.margin_top = tf_multi.margin_bottom = 0

    p_m = tf_multi.paragraphs[0]
    r_m = p_m.add_run()
    r_m.text = "Multilingual Speech & Tactile Humanism"
    r_m.font.name = FONT_TITLE
    r_m.font.size = Pt(15)
    r_m.font.bold = True
    r_m.font.color.rgb = COLOR_PRIMARY_BLUE

    multi_points = [
        ("Browser-Native Web Speech API", "Leverages built-in OS speech recognition engines (Chrome/Edge/Android) with zero API keys and zero network latency."),
        ("Regional Indian Languages", "Native acoustic models tuned for Hindi, Bengali, Marathi, Telugu, Tamil, and Indian English with accent tolerance."),
        ("Audio Prompt Voice Synthesis", "Patients can tap 'Listen in Hindi / सुनें' to hear legal consent and instructions spoken aloud through kiosk speakers."),
        ("Tactile Pictographic Cards", "Oversized pill cards with clear iconography (sun, calendar, medication, clock) enable illiterate citizens to simply tap their answers."),
        ("Bilingual Typography", "Every headline and response option displays paired English and Devanagari/regional scripts simultaneously.")
    ]

    for h, b in multi_points:
        p_pt = tf_multi.add_paragraph()
        p_pt.space_before = Pt(6)
        r_h = p_pt.add_run()
        r_h.text = f"✔ {h}: "
        r_h.font.name = FONT_TITLE
        r_h.font.size = Pt(10.5)
        r_h.font.bold = True
        r_h.font.color.rgb = COLOR_PRIMARY_BLUE

        r_b = p_pt.add_run()
        r_b.text = b
        r_b.font.name = FONT_BODY
        r_b.font.size = Pt(9.5)
        r_b.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 9: FULLSTACK ARCHITECTURE & TECH STACK
    # =========================================================================
    s9 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s9)
    add_header(s9, "Technical Blueprint", "Fullstack System Architecture: Edge-First & Zero-Cost", "Engineered for high performance, zero runtime license fees, and instant national deployment.")
    add_footer(s9, 9)

    layers = [
        ("1. Presentation Tier (Kiosk Frontend)", 
         "Next.js 15 App Router • React 19 • Tailwind CSS\n\n• Plus Jakarta Sans & Inter typographic hierarchy.\n• 72px tactile touch pill components with active vibration / visual affordance.\n• Web Speech API hook supporting continuous listening & interim transcripts.\n• Canvas glare-reducing ice-blue theme designed for commercial kiosk panels.", 
         COLOR_PRIMARY_BLUE),
        ("2. Clinical Reasoning Tier", 
         "Gemini 2.0 Flash • Next.js Route Handlers\n\n• /api/gemini/follow-up: Adaptive SOCRATES & AYUSH question generation.\n• /api/gemini/summary: Comprehensive medical history synthesis from transcript + OCR.\n• Deterministic Red-Flag Engine: Sub-millisecond keyword regex matcher.\n• Local Clinical Heuristic Fallback for complete offline reliability.", 
         COLOR_TEAL),
        ("3. Vision & Data Tier", 
         "Tesseract.js WASM • React Context • LocalStorage\n\n• Client-Side OCR: WebAssembly-compiled Tesseract.js for prescription processing.\n• Ephemeral Kiosk Storage: Automatic session purging upon token issuance.\n• Seeded & Dynamic Queue: Real-time physician triage queue with priority categorization.\n• HL7 FHIR R4 Bundle Ready schema for ABDM integration.", 
         COLOR_EMERALD)
    ]

    for idx, (title, desc, color) in enumerate(layers):
        c_left = Inches(0.8 + idx * 4.0)
        c_top = Inches(2.0)
        c_width = Inches(3.75)
        c_height = Inches(4.6)

        add_card(s9, c_left, c_top, c_width, c_height, bg_color=COLOR_WHITE, border_color=color, border_width=1.5)

        # Header tag
        tag = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_left, c_top, c_width, Inches(0.45))
        tag.fill.solid()
        tag.fill.fore_color.rgb = color
        tag.line.fill.background()
        tf_tag = tag.text_frame
        p_tag = tf_tag.paragraphs[0]
        p_tag.alignment = PP_ALIGN.CENTER
        r_tag = p_tag.add_run()
        r_tag.text = title.upper()
        r_tag.font.name = FONT_TITLE
        r_tag.font.size = Pt(10)
        r_tag.font.bold = True
        r_tag.font.color.rgb = COLOR_WHITE

        # Body
        tb = s9.shapes.add_textbox(c_left + Inches(0.2), c_top + Inches(0.6), Inches(3.35), Inches(3.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = desc
        r.font.name = FONT_BODY
        r.font.size = Pt(10.5)
        r.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 10: PHYSICIAN EXPERIENCE & OPD DASHBOARD
    # =========================================================================
    s10 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s10)
    add_header(s10, "Doctor Experience", "Physician Experience: Slashing Typing, Restoring Empathy", "How MediKiosk turns pre-intake data into actionable 20-second clinical summaries.")
    add_footer(s10, 10)

    # Left: The Physician Workflow
    add_card(s10, Inches(0.8), Inches(2.0), Inches(5.7), Inches(4.6), bg_color=COLOR_WHITE, border_color=COLOR_PRIMARY_BLUE, border_width=1.5)
    tb_pw = s10.shapes.add_textbox(Inches(1.05), Inches(2.2), Inches(5.2), Inches(4.2))
    tf_pw = tb_pw.text_frame
    tf_pw.word_wrap = True
    tf_pw.margin_left = tf_pw.margin_right = tf_pw.margin_top = tf_pw.margin_bottom = 0

    p = tf_pw.paragraphs[0]
    r = p.add_run()
    r.text = "The Room 12 Physician Workflow"
    r.font.name = FONT_TITLE
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = COLOR_PRIMARY_BLUE

    pw_steps = [
        ("Fast Staff Sign-In", "Doctor logs into duty console in 800ms via registered mobile or hospital staff ID with zero password friction."),
        ("Live Triage Queue Priority", "Dashboard automatically segments patients by severity: Red Alert ('Urgent Triage'), Amber ('Review Needed'), Green ('Standard')."),
        ("Pre-Structured Clinical Encounter", "Instead of starting with a blank screen, doctor opens a pre-drafted dossier: Chief Complaint, HPI, Past Illness, Drug Allergies, and OCR Notes."),
        ("One-Click 'Call In' Chime", "Tapping 'Accept Patient / Call In' sounds a gentle chime in the waiting lobby and updates patient status in 1 click."),
        ("Zero Administrative Burden", "Recovers 90–120 seconds of typing per patient, allowing the doctor to focus entirely on physical examination and diagnosis.")
    ]

    for h, b in pw_steps:
        p_pt = tf_pw.add_paragraph()
        p_pt.space_before = Pt(6)
        r_h = p_pt.add_run()
        r_h.text = f"✔ {h}: "
        r_h.font.name = FONT_TITLE
        r_h.font.size = Pt(10.5)
        r_h.font.bold = True
        r_h.font.color.rgb = COLOR_PRIMARY_BLUE

        r_b = p_pt.add_run()
        r_b.text = b
        r_b.font.name = FONT_BODY
        r_b.font.size = Pt(9.5)
        r_b.font.color.rgb = COLOR_TEXT_MAIN

    # Right: Mock Clinical Summary Breakdown
    add_card(s10, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.6), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER)
    tb_ms = s10.shapes.add_textbox(Inches(7.05), Inches(2.2), Inches(5.2), Inches(4.2))
    tf_ms = tb_ms.text_frame
    tf_ms.word_wrap = True
    tf_ms.margin_left = tf_ms.margin_right = tf_ms.margin_top = tf_ms.margin_bottom = 0

    p_m = tf_ms.paragraphs[0]
    r_m = p_m.add_run()
    r_m.text = "Generated Clinical Summary Structure"
    r_m.font.name = FONT_TITLE
    r_m.font.size = Pt(15)
    r_m.font.bold = True
    r_m.font.color.rgb = COLOR_TEAL

    sections = [
        ("Chief Complaint", "“Fever for 4 days, nocturnal dry cough, mild breathlessness” (Dictated in Hindi, translated)."),
        ("History of Presenting Illness", "58F reports moderate fever onset 4 days ago with non-productive cough, worsening at night."),
        ("Past Medical & Drug History", "Borderline hypertension (2 yrs). No known drug allergies (NKDA) reported at kiosk."),
        ("Review of Systems", "Respiratory: +Dry cough, -Hemoptysis. Cardiac: -Chest pain. GI: Normal appetite."),
        ("Extracted OCR Values", "Paracetamol 500mg TDS, Amoxicillin 250mg, BP 148/92 detected from scanned paper slip."),
        ("Triage Level & Action", "Assessed: Review Needed (Level 2). Rec OPD: Room 12 General Medicine / Pulmonology.")
    ]

    for s_title, s_content in sections:
        p_s = tf_ms.add_paragraph()
        p_s.space_before = Pt(5)
        r_st = p_s.add_run()
        r_st.text = f"• {s_title}: "
        r_st.font.name = FONT_TITLE
        r_st.font.size = Pt(10)
        r_st.font.bold = True
        r_st.font.color.rgb = COLOR_TEXT_MAIN

        r_sc = p_s.add_run()
        r_sc.text = s_content
        r_sc.font.name = FONT_BODY
        r_sc.font.size = Pt(9.5)
        r_sc.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 11: FEASIBILITY, UNIT ECONOMICS & HOSPITAL DEPLOYMENT
    # =========================================================================
    s11 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s11)
    add_header(s11, "Financial Feasibility", "Unit Economics & Hardware BOM: Amortizing to ₹0.42 / Intake", "Built entirely on standard off-the-shelf kiosk components and zero-license open-source software.")
    add_footer(s11, 11)

    # 3 Cost/Feasibility Columns
    # Col 1: Hardware BOM
    add_card(s11, Inches(0.8), Inches(2.0), Inches(3.75), Inches(4.6), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER)
    tb_b1 = s11.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(3.35), Inches(4.2))
    tf_b1 = tb_b1.text_frame
    tf_b1.word_wrap = True
    tf_b1.margin_left = tf_b1.margin_right = tf_b1.margin_top = tf_b1.margin_bottom = 0

    p = tf_b1.paragraphs[0]
    r = p.add_run()
    r.text = "Hardware Bill of Materials (BOM)"
    r.font.name = FONT_TITLE
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = COLOR_PRIMARY_BLUE

    bom_items = [
        ("21.5\" Touch Terminal", "₹22,000", "Commercial capacitive panel"),
        ("Directional USB Mic", "₹3,500", "Noise-canceling acoustic pickup"),
        ("Optical Scanner Tray", "₹4,500", "Top-down prescription capture"),
        ("Thermal Slip Printer", "₹3,500", "Direct token slip printing"),
        ("Total Kiosk Hardware", "₹33,500", "~$400 one-time capital expense")
    ]

    for item, cost, sub in bom_items:
        p_i = tf_b1.add_paragraph()
        p_i.space_before = Pt(8)
        r_it = p_i.add_run()
        r_it.text = f"• {item}: "
        r_it.font.name = FONT_TITLE
        r_it.font.size = Pt(10)
        r_it.font.bold = True
        r_it.font.color.rgb = COLOR_TEXT_MAIN

        r_c = p_i.add_run()
        r_c.text = f"{cost}\n"
        r_c.font.name = FONT_TITLE
        r_c.font.size = Pt(10.5)
        r_c.font.bold = True
        r_c.font.color.rgb = COLOR_PRIMARY_BLUE if cost.startswith("₹33") else COLOR_EMERALD

        r_s = p_i.add_run()
        r_s.text = f"  ({sub})"
        r_s.font.name = FONT_BODY
        r_s.font.size = Pt(8.5)
        r_s.font.color.rgb = COLOR_TEXT_MUTED

    # Col 2: Amortization & Operating Cost
    add_card(s11, Inches(4.8), Inches(2.0), Inches(3.75), Inches(4.6), bg_color=COLOR_WHITE, border_color=COLOR_EMERALD, border_width=1.5)
    tb_b2 = s11.shapes.add_textbox(Inches(5.0), Inches(2.2), Inches(3.35), Inches(4.2))
    tf_b2 = tb_b2.text_frame
    tf_b2.word_wrap = True
    tf_b2.margin_left = tf_b2.margin_right = tf_b2.margin_top = tf_b2.margin_bottom = 0

    p2 = tf_b2.paragraphs[0]
    r2 = p2.add_run()
    r2.text = "Amortization & Zero-Cost Stack"
    r2.font.name = FONT_TITLE
    r2.font.size = Pt(14)
    r2.font.bold = True
    r2.font.color.rgb = COLOR_EMERALD

    ops_items = [
        ("₹0.42 / Patient Intake", "In a typical hospital seeing 7,000 monthly OPD patients, the kiosk amortizes in under 12 months."),
        ("Zero Vision API Cost", "Client-side Tesseract.js eliminates recurring cloud vision fees ($1.50/1000 requests elsewhere)."),
        ("Zero ASR API Cost", "Browser Web Speech API & open Bhashini models run free without metered billing."),
        ("Zero Database Cost", "Operates via stateless ephemeral sessions and direct ABDM FHIR syncing—no massive DB licensing."),
        ("Low Power Footprint", "Consumes <45 Watts. Compatible with standard hospital emergency inverter power.")
    ]

    for h, d in ops_items:
        p_i = tf_b2.add_paragraph()
        p_i.space_before = Pt(6)
        r_h = p_i.add_run()
        r_h.text = f"✔ {h}\n"
        r_h.font.name = FONT_TITLE
        r_h.font.size = Pt(10)
        r_h.font.bold = True
        r_h.font.color.rgb = COLOR_EMERALD

        r_d = p_i.add_run()
        r_d.text = d
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(9)
        r_d.font.color.rgb = COLOR_TEXT_MAIN

    # Col 3: Deployment Roadmap
    add_card(s11, Inches(8.8), Inches(2.0), Inches(3.75), Inches(4.6), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER)
    tb_b3 = s11.shapes.add_textbox(Inches(9.0), Inches(2.2), Inches(3.35), Inches(4.2))
    tf_b3 = tb_b3.text_frame
    tf_b3.word_wrap = True
    tf_b3.margin_left = tf_b3.margin_right = tf_b3.margin_top = tf_b3.margin_bottom = 0

    p3 = tf_b3.paragraphs[0]
    r3 = p3.add_run()
    r3.text = "Phased Deployment Roadmap"
    r3.font.name = FONT_TITLE
    r3.font.size = Pt(14)
    r3.font.bold = True
    r3.font.color.rgb = COLOR_PRIMARY_BLUE

    phases = [
        ("Phase 1: Working MVP (Complete)", "Complete 13-screen responsive Next.js prototype with Web Speech, Gemini 2.0 Flash, OCR, and Red-Flag triage fully functional."),
        ("Phase 2: ABDM Sandbox Pilot (M1-M3)", "Integration with National Health Authority Sandbox for milestone 1 (ABHA creation), M2 (Health Records), and M3 (FHIR exchange)."),
        ("Phase 3: District Hospital Trial (Q3 2026)", "5-kiosk pilot deployment in AIIMS / District Civil Hospital OPD foyer with volunteer guidance."),
        ("Phase 4: State-Wide Rollout (2027)", "Replication across Community Health Centers (CHCs) and AYUSH Wellness Clinics under NHM.")
    ]

    for p_head, p_desc in phases:
        p_i = tf_b3.add_paragraph()
        p_i.space_before = Pt(6)
        r_ph = p_i.add_run()
        r_ph.text = f"• {p_head}\n"
        r_ph.font.name = FONT_TITLE
        r_ph.font.size = Pt(9.5)
        r_ph.font.bold = True
        r_ph.font.color.rgb = COLOR_TEXT_MAIN

        r_pd = p_i.add_run()
        r_pd.text = p_desc
        r_pd.font.name = FONT_BODY
        r_pd.font.size = Pt(8.5)
        r_pd.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 12: QUANTIFIED IMPACT & CLOSING VISION
    # =========================================================================
    s12 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s12, COLOR_DEEP_NAVY)

    # Header in dark mode
    tb_c12 = s12.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.733), Inches(1.2))
    tf12 = tb_c12.text_frame
    tf12.word_wrap = True

    p = tf12.paragraphs[0]
    r = p.add_run()
    r.text = "THE IMPACT HORIZON"
    r.font.name = FONT_TITLE
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(147, 204, 255)

    p_t = tf12.add_paragraph()
    p_t.space_before = Pt(6)
    r_t = p_t.add_run()
    r_t.text = "Transforming Public Health Delivery at National Scale"
    r_t.font.name = FONT_TITLE
    r_t.font.size = Pt(26)
    r_t.font.bold = True
    r_t.font.color.rgb = COLOR_WHITE

    # 4 Impact Metric Cards
    impact_stats = [
        ("+35%", "OPD Throughput Increase", "Doctors see more patients thoroughly without increasing shift hours or cognitive exhaustion.", COLOR_PRIMARY_BLUE),
        ("-75%", "Physician Typing Burden", "Shifts clerical data entry from clinical consult room to pre-waiting kiosk intake.", COLOR_EMERALD),
        ("100%", "Paper-to-Digital Onboarding", "Bridges the ABDM 'first-mile' problem by digitizing paper prescriptions on entrance.", COLOR_TEAL),
        ("0ms", "Emergency Interception", "Zero-delay deterministic detection routes critical life-threatening conditions immediately.", COLOR_CRIMSON)
    ]

    for idx, (num, title, desc, color) in enumerate(impact_stats):
        c_left = Inches(0.8 + idx * 2.95)
        card = add_card(s12, c_left, Inches(2.1), Inches(2.8), Inches(2.6), bg_color=RGBColor(19, 38, 68), border_color=color, border_width=1.5)
        
        tb = s12.shapes.add_textbox(c_left, Inches(2.1), Inches(2.8), Inches(2.6))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.2)

        p1 = tf.paragraphs[0]
        r1 = p1.add_run()
        r1.text = num
        r1.font.name = FONT_TITLE
        r1.font.size = Pt(36)
        r1.font.bold = True
        r1.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.space_before = Pt(4)
        r2 = p2.add_run()
        r2.text = title
        r2.font.name = FONT_TITLE
        r2.font.size = Pt(12)
        r2.font.bold = True
        r2.font.color.rgb = COLOR_WHITE

        p3 = tf.add_paragraph()
        p3.space_before = Pt(6)
        r3 = p3.add_run()
        r3.text = desc
        r3.font.name = FONT_BODY
        r3.font.size = Pt(10)
        r3.font.color.rgb = RGBColor(203, 213, 225)

    # Concluding Banner Box
    banner = add_card(s12, Inches(0.8), Inches(5.1), Inches(11.733), Inches(1.7), bg_color=RGBColor(15, 30, 54), border_color=COLOR_PRIMARY_BLUE, border_width=1)
    tb_b = s12.shapes.add_textbox(Inches(1.1), Inches(5.25), Inches(11.1), Inches(1.4))
    tf_b = tb_b.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = tf_b.margin_right = tf_b.margin_top = tf_b.margin_bottom = 0

    p_b1 = tf_b.paragraphs[0]
    r_b1 = p_b1.add_run()
    r_b1.text = "“MediKiosk turns the hospital waiting foyer into an intelligent clinical gateway—"
    r_b1.font.name = FONT_TITLE
    r_b1.font.size = Pt(15)
    r_b1.font.bold = True
    r_b1.font.color.rgb = COLOR_WHITE

    p_b2 = tf_b.add_paragraph()
    r_b2 = p_b2.add_run()
    r_b2.text = "restoring dignity to patients and empathy and time to India's physicians.”"
    r_b2.font.name = FONT_TITLE
    r_b2.font.size = Pt(15)
    r_b2.font.bold = True
    r_b2.font.color.rgb = RGBColor(147, 204, 255)

    p_b3 = tf_b.add_paragraph()
    p_b3.space_before = Pt(8)
    r_b3 = p_b3.add_run()
    r_b3.text = "Team Allied • Smart India Hackathon 2026 • Problem Statement SIH26047 • Working Prototype: https://github.com/demovirat4-max/SIH-MediKiosk"
    r_b3.font.name = FONT_BODY
    r_b3.font.size = Pt(10.5)
    r_b3.font.color.rgb = RGBColor(148, 163, 184)

    output_path = 'MediKiosk_Executive_Pitch_SIH2026.pptx'
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == '__main__':
    create_deck()
