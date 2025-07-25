# 🥩 Meat Quality Classification App

[![Framework](https://img.shields.io/badge/Framework-Custom%20CNN-blueviolet)]()
![Language](https://img.shields.io/badge/Language-Python-79FFB2)
[![Model](https://img.shields.io/badge/Model-FastCNN%20%7C%20ResNet-FF8C00)]()
[![Toolkits](https://img.shields.io/badge/Libraries-OpenCV%20%7C%20Keras%20%7C%20TensorFlow-lightgrey)]()

---

## 🧠 Project Name: **A REAL TIME NON DESTRUCTIVE AR BASED MOBILE APPLICATION FOR ASSURING THE QUALITY OF RAW MEAT ITEMS using Deep Learning**

This project presents a deep learning-based solution for classifying **meat quality** using FastCNN and ResNet models. It uses **image processing and classification techniques** to predict the condition of raw meat—such as *Fresh*, *Not Fresh*, or *Spolied*. It also includes real-time region detection and an AR-style output display.

---

## 🚀 Functional Requirements 
The functional requirements of the proposed project are

** Mobile App Manager **
The mobile app manager provides as an interface for the consumer where they capture the 
meat item(s) images from the mobile camera. 

** Image Processing **
The image processing module analyses visual data captured on the user’s mobile device. 

** Meat Type Classification **
The project automatically classify the meat as either Beef, Chicken, or Fish. 

** Real-Time Freshness Analysis **
The proposed project analyze the uploaded image in real time to assess the freshness level 
of the meat. 

** Freshness Classification Output **
The project provide results in the form of freshness levels: 
 Fresh  
 Not Fresh 
 Spoiled 
 Augmented Reality Overlay 
The proposed project overlay the analysis result directly on the meat image using AR 
technology, highlighting key areas of concern. 

** Generate AR Report **
The proposed project generate a downloadable report summarizing the freshness analysis 
for each meat sample. 

### 🎥 Demo Video

[![Watch the Demo]](https://github.com/ShifaZahra123/Final-Year-Project-2025/blob/main/Demo%20Video.mp4)

---

### 🧩 Proposed Project Architecture

![Architecture Diagram](https://raw.githubusercontent.com/ShifaZahra123/Final-Year-Project-2025/main/Architecture%20Diagram.jpeg)

---

## 🧪 Dataset

* **Type**: Raw images of chicken and beef
* **Labels**: Fresh, Not Fresh, Spoiled
* **Size**: 224x224 RGB images
* **Environment**: Captured in real-time environment

---

## 🛠 Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/meat-quality-classifier.git
   cd meat-quality-classifier
   ```

2. **Create a virtual environment (optional but recommended)**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install required packages**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the main code**:

   ```bash
   python main.py
   ```

---

## 📁 Project Structure

```
FYP/
├── Backend/                 # All Python source files
│   ├── fast_cn_restnet_moel.h5
│   ├── best_fast_cnn_model.h5
├── FYP Report/               # Final year report
├── FYP Presentation/         # FYP presentation slides
├── Demo Video.mp4        # Working demo
├── dataset/              # Sample raw image dataset
└── README.md
```

---

## 📸 Screenshots

| ROI Extraction            | Classification Output      | Alert Display              |
| ------------------------- | -------------------------- | -------------------------- |
| ![](docs/roi_example.png) | ![](docs/class_output.png) | ![](docs/alert_system.png) |



## 🤝 Authors

| Name               | Role                 | Affiliation                                 |
| ------------------ | -------------------- | ------------------------------------------- |
| Shifa Zahra        | FYP Lead             | BSCS, Lahore College for Women University  |
| Dr. Mariam Nosheen | Academic Guide       | Computer Science, LCWU                      |

---

## 📚 Resources

* [OpenCV Documentation](https://docs.opencv.org/)
* [Keras & TensorFlow](https://www.tensorflow.org/)
* [XGBoost Docs](https://xgboost.readthedocs.io/)

---

## 🧾 License

This project is part of an undergraduate research and final year project submission. Not licensed for commercial use without permission.
