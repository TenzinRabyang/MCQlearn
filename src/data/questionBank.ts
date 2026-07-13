import { Question } from "@/types";
import originalQuestionsData from "@/data/questions.json";
import dementiaAndSafeguardingData from "@/data/imported/dementia-and-safeguarding.json";
import drugAdministrationData from "@/data/imported/drug-administration-roles-responsibilities.json";
import introductionRiskAssessmentsData from "@/data/imported/introduction-risk-assessments.json";
import legUlcersData from "@/data/imported/leg-ulcers-skin-tears-lymphoedema.json";
import medicinesManagementData from "@/data/imported/nurses-role-medicines-management.json";
import pressureUlcersData from "@/data/imported/pressure-ulcers-pathophysiology-prevention.json";
import sbarData from "@/data/imported/sbar-clinical-communication.json";
import skinConditionsData from "@/data/imported/skin-conditions-and-wound-healing.json";
import woundCareData from "@/data/imported/wound-care-pathophysiology-assessment.json";
import woundDressingsData from "@/data/imported/wound-dressings-selection-formularies.json";

export const originalQuestions = originalQuestionsData as Question[];

export const importedSubjects = [
  {
    slug: "drug-administration-roles-responsibilities",
    title: "Drug Administration Roles & Responsibilities",
    questions: drugAdministrationData as Question[],
  },
  {
    slug: "dementia-and-safeguarding",
    title: "Dementia and Safeguarding",
    questions: dementiaAndSafeguardingData as Question[],
  },
  {
    slug: "introduction-risk-assessments",
    title: "Introduction Risk Assessments",
    questions: introductionRiskAssessmentsData as Question[],
  },
  {
    slug: "leg-ulcers-skin-tears-lymphoedema",
    title: "Leg Ulcers, Skin Tears & Lymphoedema",
    questions: legUlcersData as Question[],
  },
  {
    slug: "nurses-role-medicines-management",
    title: "Nurses Role Medicines Management",
    questions: medicinesManagementData as Question[],
  },
  {
    slug: "pressure-ulcers-pathophysiology-prevention",
    title: "Pressure Ulcers Pathophysiology Prevention",
    questions: pressureUlcersData as Question[],
  },
  {
    slug: "sbar-clinical-communication",
    title: "SBAR Clinical Communication",
    questions: sbarData as Question[],
  },
  {
    slug: "skin-conditions-and-wound-healing",
    title: "Skin Conditions and Wound Healing",
    questions: skinConditionsData as Question[],
  },
  {
    slug: "wound-care-pathophysiology-assessment",
    title: "Wound Care Pathophysiology Assessment",
    questions: woundCareData as Question[],
  },
  {
    slug: "wound-dressings-selection-formularies",
    title: "Wound Dressings Selection Formularies",
    questions: woundDressingsData as Question[],
  },
] as const;

export const importedQuestions = importedSubjects.flatMap((subject) => subject.questions);
export const allQuestions = [...originalQuestions, ...importedQuestions];

export const originalCategories = Array.from(
  new Set(originalQuestions.map((question) => question.category)),
);
