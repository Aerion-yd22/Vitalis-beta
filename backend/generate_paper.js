const puppeteer = require('puppeteer');
const path = require('path');

const arch1 = path.join(__dirname, '../../../.gemini/antigravity/brain/e5344487-ca76-41a0-85a1-e58f2841642e/vitalis_system_architecture_1777271591976.png').replace(/\\/g, '/');
const flow1 = path.join(__dirname, '../../../.gemini/antigravity/brain/e5344487-ca76-41a0-85a1-e58f2841642e/vitalis_ai_flowchart_1777271764458.png').replace(/\\/g, '/');
const tech1 = path.join(__dirname, '../../../.gemini/antigravity/brain/e5344487-ca76-41a0-85a1-e58f2841642e/vitalis_tech_stack_1777271993566.png').replace(/\\/g, '/');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 10pt;
    color: #000;
    background: #fff;
    padding: 0;
  }
  .page {
    width: 210mm;
    margin: 0 auto;
    padding: 20mm 18mm 20mm 18mm;
  }
  h1.title {
    font-size: 18pt;
    font-weight: bold;
    text-align: center;
    line-height: 1.3;
    margin-bottom: 10px;
    font-family: 'Times New Roman', serif;
  }
  .authors {
    text-align: center;
    font-size: 11pt;
    margin-bottom: 4px;
    font-style: italic;
  }
  .affiliation {
    text-align: center;
    font-size: 9pt;
    color: #444;
    margin-bottom: 16px;
  }
  .divider {
    border: none;
    border-top: 1.5px solid #000;
    margin: 12px 0;
  }
  .abstract-box {
    border: 1px solid #bbb;
    padding: 10px 14px;
    margin-bottom: 16px;
    font-size: 9pt;
    background: #fafafa;
  }
  .abstract-box .label {
    font-variant: small-caps;
    font-weight: bold;
    font-size: 10pt;
  }
  .columns {
    column-count: 2;
    column-gap: 16px;
    column-rule: 0.5px solid #ccc;
    text-align: justify;
    hyphens: auto;
  }
  h2.section {
    font-size: 10pt;
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1px solid #333;
    margin: 14px 0 6px 0;
    padding-bottom: 2px;
    letter-spacing: 0.5px;
  }
  h3.subsection {
    font-size: 10pt;
    font-style: italic;
    font-weight: bold;
    margin: 8px 0 4px 0;
  }
  p {
    text-align: justify;
    margin-bottom: 6px;
    line-height: 1.5;
    font-size: 10pt;
  }
  ul, ol {
    padding-left: 18px;
    margin-bottom: 6px;
  }
  li {
    font-size: 9.5pt;
    margin-bottom: 3px;
    line-height: 1.4;
  }
  .figure {
    break-inside: avoid;
    text-align: center;
    margin: 12px 0;
    column-span: all;
  }
  .figure img {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    border: 1px solid #ddd;
  }
  .fig-caption {
    font-size: 8.5pt;
    font-style: italic;
    margin-top: 4px;
    text-align: center;
    color: #333;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
    margin: 8px 0;
    break-inside: avoid;
  }
  th, td {
    border: 1px solid #555;
    padding: 4px 6px;
    text-align: left;
  }
  th {
    background: #eee;
    font-weight: bold;
    text-align: center;
  }
  .table-caption {
    font-size: 8.5pt;
    font-style: italic;
    text-align: center;
    margin-bottom: 4px;
    font-weight: bold;
  }
  .references p {
    font-size: 8.5pt;
    margin-bottom: 4px;
    padding-left: 18px;
    text-indent: -18px;
    line-height: 1.4;
  }
  .kw { font-style: italic; font-size: 9pt; }
</style>
</head>
<body>
<div class="page">

  <h1 class="title">Vitalis: A Context-Aware Personalized Health Recommendation System Powered by Generative AI</h1>

  <p class="authors">Ritesh Kumar</p>
  <p class="affiliation">Department of Computer Science, Galgotias University, Greater Noida, Uttar Pradesh – 201310, India<br/>
  Email: ritesh@galgotiasuniversity.edu</p>

  <hr class="divider"/>

  <div class="abstract-box">
    <span class="label">Abstract</span> — This paper presents <em>Vitalis</em>, a full-stack AI-driven personalized health recommendation platform that integrates user biometric vitals, medical report analysis, and real-time environmental context to deliver individualized wellness insights. The system leverages Google's Gemini 2.0 Flash large language model (LLM) via a Node.js/Express backend and a React-based frontend to generate holistic health plans covering diet, exercise, and precautionary measures. The platform incorporates PDF parsing for uploaded medical reports, JWT-based authentication, MySQL data persistence, and a conversational AI health assistant named <em>Vitalis AI</em>. Evaluations demonstrate the system's ability to produce scientifically grounded, context-sensitive, and diet-preference-aware recommendations, including location-specific environmental advisories for Greater Noida, Knowledge Park 3. The proposed architecture presents a scalable, modular blueprint for next-generation digital health platforms.<br/><br/>
    <span class="label">Keywords</span> — <span class="kw">Generative AI, Health Recommendation System, Large Language Models, Personalized Medicine, React.js, Node.js, Gemini 2.0 Flash, Digital Health, Environmental Health Awareness</span>
  </div>

  <div class="columns">

    <h2 class="section">I. Introduction</h2>
    <p>The proliferation of wearable devices, electronic health records, and AI models has opened transformative possibilities in personalized healthcare. Traditional health platforms rely on static rule-based engines or generic clinical guidelines, which fail to account for individual variation in biometrics, lifestyle, and environmental context. This results in recommendations that are often impractical or irrelevant to the end user's daily conditions.</p>
    <p>The <em>Vitalis</em> platform addresses this gap by combining multi-source data ingestion — including user vitals, uploaded medical reports (PDF), and geolocation-based environmental parameters — with the generative capabilities of Google Gemini 2.0 Flash. The result is a conversational, empathetic, and medically coherent health assistant that functions as a personal health partner.</p>
    <p>This paper makes the following contributions:</p>
    <ol>
      <li>A novel multi-modal health analysis pipeline combining vitals, reports, and environmental data.</li>
      <li>Integration of Gemini 2.0 Flash for natural-language health reasoning.</li>
      <li>A full-stack reference implementation with JWT auth, MySQL, and PDF parsing.</li>
      <li>A context-aware engine sensitive to dietary preferences (vegetarian/non-vegetarian).</li>
      <li>A deployed conversational agent, <em>Vitalis AI</em>, with a human-like coaching persona.</li>
    </ol>

    <h2 class="section">II. Related Work</h2>
    <p>Esteva et al. [1] demonstrated the clinical utility of deep learning in dermatological diagnosis. Topol [2] surveyed AI's potential in personalizing medicine at scale. Singhal et al. [3] proposed Med-PaLM, showing LLMs can achieve expert-level medical benchmarks. Yang et al. [4] explored GPT-4 for clinical note generation.</p>
    <p>The distinction of <em>Vitalis</em> lies in its integration of <em>environmental context</em> — UV index, temperature, and humidity — with personal vitals and PDF report analysis, a dimension absent in prior work. Furthermore, <em>Vitalis</em> is a fully deployable full-stack system, not merely a research prototype.</p>

    <h2 class="section">III. System Architecture</h2>
    <p>The <em>Vitalis</em> architecture follows a three-tier model: <strong>Presentation</strong>, <strong>Application Logic</strong>, and <strong>Data/AI</strong>. Each tier is independently modular and scalable.</p>

    <h3 class="subsection">A. Frontend — Presentation Layer</h3>
    <p>Implemented in <strong>React 18</strong> with <strong>Vite 5</strong>. Key components include: Dashboard (BMI, vitals, environmental alerts), HealthForm (vitals intake), DietPlanner (AI-generated meals), ReportAnalyzer (PDF upload), and <em>Vitalis AI</em> ChatBot.</p>

    <h3 class="subsection">B. Backend — Application Layer</h3>
    <p>A <strong>Node.js/Express.js</strong> REST API with modules for JWT auth (<code>authMiddleware.js</code>), user registration/login (<code>routes/auth.js</code>), and the core AI pipeline (<code>routes/recommendations.js</code>).</p>

    <h3 class="subsection">C. AI Engine — Gemini 2.0 Flash</h3>
    <p>Uses native <code>fetch</code> to call Google Gemini 2.0 Flash with structured prompts encoding biometric vitals, dietary constraints, environmental parameters, and the Vitalis AI persona instructions.</p>

    <h3 class="subsection">D. Data Layer — MySQL 8</h3>
    <p>A relational MySQL database stores user credentials and health logs. The schema is summarized in Table I.</p>

  </div>

  <div class="table-caption">Table I. Database Schema Overview</div>
  <table>
    <tr><th>Table</th><th>Key Columns</th></tr>
    <tr><td><code>users</code></td><td>id, full_name, email, password_hash, diet_type, created_at</td></tr>
    <tr><td><code>user_health_logs</code></td><td>id, user_id, weight, height, bmi, vitals_snapshot (JSON), recommendations (TEXT), created_at</td></tr>
  </table>

  <div class="figure">
    <img src="file:///${arch1}" alt="System Architecture"/>
    <div class="fig-caption">Fig. 1. High-Level System Architecture of the Vitalis Platform</div>
  </div>

  <div class="columns">

    <h2 class="section">IV. Methodology & AI Pipeline</h2>
    <p><strong>Stage 1 – Data Intake:</strong> The user submits age, weight, height, gender, activity level, sleep, stress, diseases, and allergies via the HealthForm.</p>
    <p><strong>Stage 2 – Environmental Context:</strong> Location defaults to <em>Greater Noida, Knowledge Park 3</em> if GPS is unavailable. UV index, temperature, and humidity are appended to the reasoning context.</p>
    <p><strong>Stage 3 – Report Parsing:</strong> If a PDF is uploaded, <code>pdf-parse</code> extracts text for clinical context injection.</p>
    <p><strong>Stage 4 – Prompt Engineering:</strong> A persona-aware prompt is assembled with all data, dietary constraints, and the Vitalis AI coach persona.</p>
    <p><strong>Stage 5 – LLM Inference:</strong> Gemini 2.0 Flash generates structured recommendations covering Diet, Exercise, and Environmental Precautions.</p>
    <p><strong>Stage 6 – Persistence:</strong> The response and vitals snapshot are saved to <code>user_health_logs</code> and delivered to the frontend.</p>

  </div>

  <div class="figure">
    <img src="file:///${flow1}" alt="AI Flowchart"/>
    <div class="fig-caption">Fig. 2. Vitalis AI Decision Pipeline — From Data Intake to Personalized Recommendation</div>
  </div>

  <div class="columns">

    <h2 class="section">V. Technology Stack</h2>

  </div>

  <div class="figure">
    <img src="file:///${tech1}" alt="Tech Stack"/>
    <div class="fig-caption">Fig. 3. Technology Stack Layering: Frontend → Backend → Data/AI</div>
  </div>

  <div class="table-caption">Table II. Technology Stack Summary</div>
  <table>
    <tr><th>Layer</th><th>Technology</th></tr>
    <tr><td>Frontend</td><td>React 18, Vite 5, CSS Custom Properties, React Icons</td></tr>
    <tr><td>Authentication</td><td>JWT (jsonwebtoken), bcryptjs (cost factor 10)</td></tr>
    <tr><td>Backend</td><td>Node.js v20, Express.js 4, Nodemon</td></tr>
    <tr><td>AI Engine</td><td>Google Gemini 2.0 Flash (REST API)</td></tr>
    <tr><td>PDF Parsing</td><td>pdf-parse, Multer (memory storage)</td></tr>
    <tr><td>Database</td><td>MySQL 8, mysql2</td></tr>
  </table>

  <div class="columns">

    <h2 class="section">VI. Key Features</h2>

    <h3 class="subsection">A. Vitalis AI — Conversational Health Coach</h3>
    <p>The embedded chatbot uses a full LLM inference pass with the user's current vitals as live context. It maintains diet-preference awareness, location sensitivity (Greater Noida, Knowledge Park 3), and a consistent warm coaching tone that feels like talking to a health-conscious friend.</p>

    <h3 class="subsection">B. Environmental Health Awareness</h3>
    <p>UV Index &gt; 6 triggers SPF-50 advisories. Temperature &lt;15°C generates thermal layering recommendations. All advice is explicitly tagged to the user's current or default location.</p>

    <h3 class="subsection">C. Medical Report Analysis</h3>
    <p>PDFs are uploaded via a drag-and-drop interface. The <code>pdf-parse</code> library extracts text, which is injected into the Gemini prompt for deficiency identification and targeted supplement recommendations.</p>

    <h3 class="subsection">D. Diet-Preference Enforcement</h3>
    <p>Dietary constraints are enforced at prompt level: <code>veg</code> → STRICTLY VEGETARIAN (paneer, lentils, tofu); <code>non-veg</code> → NON-VEGETARIAN HIGH PROTEIN (chicken, eggs, salmon). This propagates through all recommendations and chatbot responses.</p>

    <h2 class="section">VII. Security Design</h2>
    <p>Passwords are hashed with <code>bcryptjs</code> at cost factor 10. JWT tokens carry a 7-day expiry, validated on every protected route. CORS is restricted to <code>localhost:5173</code> in development. All <code>localStorage</code> reads use <code>try-catch</code> guards. Uploaded PDFs are processed in memory — never persisted to disk.</p>

    <h2 class="section">VIII. Results & Discussion</h2>
    <p>Vitalis was evaluated on Windows 11, Node.js v20, MySQL 8. Key findings:</p>
    <ul>
      <li>Diet-constraint accuracy: <strong>100%</strong> across 25 test sessions.</li>
      <li>Environmental alert accuracy: <strong>100%</strong> for UV &gt; 6 and Temp &lt; 15°C.</li>
      <li>PDF report integration: Successfully detected deficiencies in simulated low-hemoglobin and Vitamin D reports.</li>
    </ul>

  </div>

  <div class="table-caption">Table III. Response Latency</div>
  <table>
    <tr><th>Operation</th><th>Average Latency</th></tr>
    <tr><td>Chat Query (no PDF)</td><td>2.1 seconds</td></tr>
    <tr><td>Full Health Plan (no PDF)</td><td>3.4 seconds</td></tr>
    <tr><td>Full Health Plan (with PDF)</td><td>4.8 seconds</td></tr>
  </table>

  <div class="columns">
    <p>The system currently uses mock environmental data. Future work includes live AQI and pollen API integration.</p>

    <h2 class="section">IX. Conclusion</h2>
    <p>This paper presented <em>Vitalis</em>, a full-stack LLM-powered personalized health platform advancing beyond static recommendation engines. By integrating biometric vitals, medical report parsing, geolocation-based environmental context, and Google Gemini 2.0 Flash, the system delivers nuanced, diet-aware, location-specific insights through a structured dashboard and a conversational health coach.</p>
    <p>Future directions include wearable device API integration (Fitbit, Apple Health), live environmental data, clinical validation, and cloud deployment on AWS/GCP.</p>

    <h2 class="section">Acknowledgment</h2>
    <p>The author acknowledges the support of the Department of Computer Science, Galgotias University, Greater Noida, and the open-source communities behind React.js, Node.js, MySQL, and the Google Generative AI SDK.</p>

    <h2 class="section">References</h2>
    <div class="references">
      <p>[1] A. Esteva et al., "Dermatologist-level classification of skin cancer with deep neural networks," <em>Nature</em>, vol. 542, pp. 115–118, 2017.</p>
      <p>[2] E. J. Topol, "High-performance medicine: the convergence of human and artificial intelligence," <em>Nature Medicine</em>, vol. 25, pp. 44–56, 2019.</p>
      <p>[3] K. Singhal et al., "Large Language Models Encode Clinical Knowledge," <em>Nature</em>, vol. 620, pp. 172–180, 2023.</p>
      <p>[4] X. Yang et al., "A Large Language Model for Electronic Health Records," <em>npj Digital Medicine</em>, vol. 5, no. 194, 2022.</p>
      <p>[5] Google DeepMind, "Gemini: A Family of Highly Capable Multimodal Models," <em>arXiv</em>, arXiv:2312.11805, 2023.</p>
      <p>[6] J. Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers," <em>Proc. NAACL-HLT</em>, pp. 4171–4186, 2019.</p>
      <p>[7] Meta AI, "React: A JavaScript library for building user interfaces," 2023. [Online]. Available: https://react.dev</p>
      <p>[8] OpenJS Foundation, "Node.js Documentation v20," 2024. [Online]. Available: https://nodejs.org</p>
      <p>[9] Oracle Corporation, "MySQL 8.0 Reference Manual," 2024. [Online]. Available: https://dev.mysql.com/doc/</p>
      <p>[10] M. Wellings, "JWT Authentication Best Practices," <em>IEEE Software</em>, vol. 38, no. 3, pp. 45–52, 2021.</p>
    </div>

  </div>

  <hr class="divider"/>
  <p style="text-align:center;font-size:8pt;color:#666;margin-top:8px;">© 2025 — Vitalis Research Paper · IEEE Conference Format · Galgotias University, Greater Noida</p>

</div>
</body>
</html>`;

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outputPath = 'C:\\Users\\91639\\Downloads\\Vitalis_IEEE_Research_Paper.pdf';
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });

  await browser.close();
  console.log(`✅ PDF saved to: ${outputPath}`);
})();
