# NoVAGraphS Translation System

**Bachelor's Thesis Project (2024)**

This repository contains the architecture and evaluation for translating Controlled Natural Language (CNL) input into structured commands for a Finite State Automaton (FSA) expert chatbot, leveraging Large Language Models (LLMs).

## 📄 Documentation
- [Bachelor's Thesis (PDF)](docs/Tesi_Triennale_Candela_Davide.pdf)
- [Defense Presentation (PDF)](docs/Presentazione_Tesi_Candela_Davide.pdf)

## 🏗️ Architecture & Approach
The system uses LLMs to parse and translate user inputs into a domain-specific representation. The core logic is implemented in Jupyter Notebooks:
- **Prompt Engineering**: Tuning LLM prompts to handle finite state automata constraints.
- **Translation System**: Handles the interactions and natural language processing.
- **Evaluation**: Validation of the translated outputs against the expected FSA states.

## 📂 Repository Structure
- `/prompt_engineering/`: Notebooks and data for prompt tuning.
- `/final_evaluation/`: Evaluation scripts and performance metrics.
- `/models/` & `/public/`: Chatbot structure and AIML files.
- `NoVAGraphS_Translation_System.ipynb`: Main translation logic.