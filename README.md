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

The following modules define the core functionalities of the **Raw Meat Quality Classification System**:

### 📱 **Mobile App Manager**

* Acts as the primary user interface.
* Captures meat item images via mobile device camera.
* Uploads images to the server for backend processing.
* Delivers final reports with AR visualization.

### 🖼️ **Image Processing**

* Processes captured images using computer vision techniques.
* Applies contrast stretching, resizing, and background removal.
* Prepares data for classification stages.

### 🍗 **Meat Type Classification**

* Automatically classifies the type of meat using a CNN model.
* Categories include:

  * Chicken
  * Beef
  * Fish

### 🕒 **Real-Time Freshness Analysis**

* Analyzes uploaded images in real-time to determine meat freshness.
* Uses FastCNN and ResNet-based models.

### 🧪 **Freshness Classification Output**

* Provides results in well-defined quality levels:

  * **Fresh**
  * **Not Fresh**
  * **Spoiled**

### 🧠 **Augmented Reality Overlay**

* Overlays classification results directly on the meat image.
* Highlights critical areas using bounding boxes and probability scores.
* Simulates AR experience for user interpretability.

### 🧾 **Generate AR Report**

* Compiles analysis results into a downloadable report.
* Summarizes:

  * Meat type
  * Freshness level
  * Detection confidence
  * Image with AR annotations

---

### 🎥 Demo Video

[![Watch the Demo]](https://github.com/ShifaZahra123/Final-Year-Project-2025/blob/main/Demo%20Video.mp4)

---


## 📸 Screenshots of Mobile App

<p align="center">
  <img src="https://github.com/ShifaZahra123/Final-Year-Project-2025/blob/main/Mobile%20App%20Demo/Mobile%20App%20Login%20Page.png"/>
  <img src="https://github.com/ShifaZahra123/Final-Year-Project-2025/blob/main/Mobile%20App%20Demo/Mobile%20App%20Choose%20Image.png"/>
  <img src="https://github.com/ShifaZahra123/Final-Year-Project-2025/blob/main/Mobile%20App%20Demo/Mobile%20App%20Meat%20Quality%20Results.png"/>
</p>


![Mobile App](https://github.com/ShifaZahra123/Final-Year-Project-2025/blob/main/Mobile%20App%20Demo/Mobile%20App%20Login%20Page.png)       
![Mobile App](https://github.com/ShifaZahra123/Final-Year-Project-2025/blob/main/Mobile%20App%20Demo/Mobile%20App%20Choose%20Image.png)          
![Mobile App](https://github.com/ShifaZahra123/Final-Year-Project-2025/blob/main/Mobile%20App%20Demo/Mobile%20App%20Meat%20Quality%20Results.png)


---

### 🧩 Proposed Project Architecture Diagram

![Architecture Diagram](https://raw.githubusercontent.com/ShifaZahra123/Final-Year-Project-2025/main/Architecture%20Diagram.jpeg)

---


### 🧩 Proposed Project Layer Diagram

![Architecture Diagram](https://raw.githubusercontent.com/ShifaZahra123/Final-Year-Project-2025/main/Layer%20Diagram.jpeg)

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
├── Backend Model/                 # All Python source files
│   ├── fastcnn_resnet_model.h5
│   ├── freshness_classification.ipynb
│   ├── notebook.ipynb
│   ├── Meat Type Classification/ 
│       ├── fast_cnn_best_model.h5
│       ├── dataset.txt           # Sample raw image dataset
├── FYP Report/               # Final year project report
├── FYP Presentation/         # FYP presentation slides
├── Demo Video.mp4        # Working demo            
└── README.md
```

---


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
