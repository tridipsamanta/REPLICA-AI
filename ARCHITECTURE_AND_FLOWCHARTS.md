# REPLICA — System Architecture & Data Flowcharts

This document provides a comprehensive technical overview of **REPLICA (VoiceGuard AI Voice Security & Speech Forensics Platform)**, including high-level system architecture and step-by-step data flowcharts.

---

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph ClientLayer["Frontend Layer (React 18 + TypeScript + Vite)"]
        UI["User Interface (Neon White / Cyberpunk HUD)"]
        Worklet["HTML5 AudioWorklet (16kHz PCM Capture)"]
        Viz["Forensic Visualizations (Recharts + SVG Waveform)"]
    end

    subgraph TransportLayer["Communication & Security Protocol"]
        REST["REST API Endpoint (HTTPS / HTTP)"]
        WS["WebSocket Stream Endpoint (/ws/stream)"]
        AuthGuard["JWT / OAuth2 Auth & SlowAPI Rate Limiter"]
    end

    subgraph BackendLayer["Backend Application Layer (FastAPI + Python 3.12)"]
        StreamProc["Sliding Window Processor (4s Window / 2s Hop)"]
        VAD["Voice Activity Detection (RMS & Peak Energy Gate)"]
        AudioPipeline["Audio Preprocessing (SoundFile, TorchAudio, Librosa)"]
    end

    subgraph ModelLayer["Deep Learning Inference & Model Registry"]
        Registry["Model Registry Manager"]
        XLSR["XLS-R-300M + AASIST Graph Attention Network (Flagship)"]
        Wav2Vec["Wav2Vec2 Anti-Spoofing Classifier"]
        WavLM["Microsoft WavLM Base Plus / Large"]
        Classical["Classical Baseline (MFCC + Random Forest / XGBoost)"]
    end

    subgraph XAILayer["Explainable AI & Forensic Engine"]
        Captum["Captum Integrated Gradients (Waveform Attribution)"]
        Occlusion["Time-Domain Segment Occlusion Scorer"]
        PDFGen["ReportLab Forensic PDF Generator"]
    end

    subgraph ProvenanceLayer["Security, Watermarking & Privacy"]
        SpectralWM["Spectral Watermark Detector / Embedder"]
        C2PA["C2PA ES256 Manifest Signer / Verifier"]
        TTLCleaner["PDPL Temp File Purger (60s TTL Sweep)"]
    end

    %% Flow Connections
    UI -->|File Upload / Requests| REST
    UI -->|Microphone Audio Stream| Worklet
    Worklet -->|16-bit PCM Chunks| WS

    REST --> AuthGuard
    WS --> AuthGuard

    AuthGuard --> AudioPipeline
    AuthGuard --> StreamProc

    StreamProc --> VAD
    VAD -->|Active Speech| Registry
    AudioPipeline --> Registry

    Registry --> XLSR
    Registry --> Wav2Vec
    Registry --> WavLM
    Registry --> Classical

    XLSR --> Captum
    Wav2Vec --> Occlusion

    Captum --> Viz
    Occlusion --> Viz

    AudioPipeline --> PDFGen
    PDFGen --> UI

    AudioPipeline --> SpectralWM
    AudioPipeline --> C2PA
    AudioPipeline --> TTLCleaner
```

---

## 2. Real-Time Live Streaming Detection Flowchart

This flowchart details how microphone audio is captured, chunked, transmitted, and evaluated continuously in the **Live Monitoring Section**.

```mermaid
flowchart TD
    A[User clicks 'Start Monitoring'] --> B[Browser requests Microphone Permission]
    B --> C[AudioContext & AudioWorklet Initialized]
    C --> D[Capture 4096 Float32 Audio Frames]
    D --> E[Resample to 16kHz Mono PCM]
    E --> F[Convert Float32 to Int16 Signed Bytes]
    F --> G[Transmit PCM Chunk over WebSocket /ws/stream]

    G --> H{FastAPI WebSocket Ingest}
    H --> I[Append Bytes to Sliding Buffer]
    I --> J{Check Received Bytes Threshold}
    J -- Under 3s --> G
    J -- Reached Evaluation Hop --> K[Extract Latest 4-Second Audio Window]

    K --> L[Calculate Audio RMS Energy & Peak Amplitude]
    L --> M{Is Audio Silent / Ambient Noise?}

    M -- Yes: RMS < 0.003 --> N[Return VAD Silence Result: Authentic Human / 0.99 Confidence]
    M -- No: Speech Present --> O[Forward Tensor to PyTorch Model Registry]

    O --> P[Run Neural Forward Pass: Wav2Vec2 / XLS-R-AASIST]
    P --> Q[Compute Softmax Probability Logits]
    Q --> R[Format StreamDetectionEvent JSON Payload]

    N --> S[Broadcast WebSocket JSON Event]
    R --> S

    S --> T[Frontend Receives Event Event]
    T --> U[Update Recharts Radar & Live Confidence Bar]
    T --> V[Shift Waveform Density Timeline]
    T --> W{Is Classification 'Synthetic'?}

    W -- Yes --> X[Trigger HUD Red Emergency Glow & Alert Sound]
    W -- No --> Y[Maintain Green Low-Risk HUD Indicator]

    X --> Z[Continue Sliding Window Evaluation Loop]
    Y --> Z
    Z --> G
```

---

## 3. Audio File Upload Detection & XAI Attribution Flowchart

This flowchart outlines what happens when a user uploads a pre-recorded audio file in the **Detect Section**.

```mermaid
flowchart TD
    A1[User drops audio file WAV / MP3 / FLAC / OGG] --> B1[Frontend validates size & local file type]
    B1 --> C1[Select Model Architecture: XLS-R + AASIST / Wav2Vec2 / Classical]
    C1 --> D1[Send POST Request with Multipart File to /detect]

    D1 --> E1[FastAPI Auth Check & Rate Limit Guard]
    E1 --> F1[Write bytes to isolated temporary file & compute SHA-256]
    F1 --> G1[SoundFile Magic Byte Check & Audio Decoding]
    G1 --> H1[Downmix to Mono & Resample to 16kHz via TorchAudio]
    H1 --> I1[Peak Amplitude Normalization]

    I1 --> J1[Load Selected Neural Model from Registry]
    J1 --> K1[Execute Model Forward Pass]
    K1 --> L1[Extract Synthetic Probability Score]

    L1 --> M1{Is Explainable AI Requested?}
    M1 -- Yes --> N1[Run Captum Integrated Gradients & Time-Domain Occlusion]
    M1 -- No --> O1[Skip XAI Generation]

    N1 --> P1[Map Waveform Attribution Scores to Time Slots]
    O1 --> Q1[Build Detection Result Schema]
    P1 --> Q1

    Q1 --> R1[Return JSON Payload to Frontend]
    R1 --> S1[Render Verdict Badge & Interactive XAI Timeline Heatmap]
    S1 --> T1[Generate Forensic Summary Card]
    T1 --> U1[Background Task: Auto-Purge Temp Audio File in 60s]
```

---

## 4. Watermarking & Provenance Verification Flowchart

This flowchart illustrates the dual-layer watermarking and C2PA cryptographic provenance verification process in the **Verify Section**.

```mermaid
flowchart TD
    A2[User submits Audio for Provenance Check] --> B2[Send Payload to /watermark/verify]
    B2 --> C2[Extract High-Frequency Spectral Band Features]
    C2 --> D2[Compute Cross-Correlation with Watermark Key Sequence]

    D2 --> E2{Is Correlation > Detection Threshold?}
    E2 -- Yes --> F2[Mark Spectral Watermark as PRESENT]
    E2 -- No --> G2[Mark Spectral Watermark as ABSENT]

    F2 --> H2[Inspect C2PA Cryptographic Manifest]
    G2 --> H2

    H2 --> I2{Does C2PA JUMBF Metadata Exist?}
    I2 -- Yes --> J2[Parse Claim Signature & ES256 Public Key Certificate]
    I2 -- No --> K2[Mark C2PA Manifest as NOT FOUND]

    J2 --> L2{Is Signature Valid?}
    L2 -- Valid --> M2[Extract Author, Generator Software & Timestamp]
    L2 -- Invalid --> N2[Flag C2PA Manifest as TAMPERED / INVALID]

    M2 --> O2[Assemble Provenance Audit Record]
    K2 --> O2
    N2 --> O2

    O2 --> P2[Display Cryptographic Verification Certificate in UI]
```

---

## 5. Summary Table: Component Interaction Matrix

| Layer / Module | Technologies | Key Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS | User interactions, Neon White / HUD themes, dynamic SVG audio visualization, WebSockets. |
| **Audio Worklet** | HTML5 Web Audio API | Low-latency audio capture, 16kHz downsampling, 16-bit PCM binary chunking. |
| **Backend API** | FastAPI, Python 3.12, Uvicorn | REST endpoints (`/detect`, `/explain`), WebSocket streaming (`/ws/stream`), auth & rate limiting. |
| **Audio Pipeline** | SoundFile, Librosa, TorchAudio | Audio decoding, channel downmixing, VAD energy gating, normalization, MFCC feature extraction. |
| **Model Engine** | PyTorch, Transformers, ONNX | Forward inference on XLS-R-300M, AASIST, Wav2Vec2, WavLM, and XGBoost models. |
| **XAI Engine** | Captum, SHAP, Scipy | Integrated Gradients, segment occlusion scoring, spectral frequency attribution maps. |
| **Provenance** | C2PA, Cryptography, ReportLab | Spectral watermark generation/detection, ES256 C2PA manifest verification, NIST PDF generation. |
