export const myEnergyServices = {
  challenges(organisationId: any) {
    return `/organisation-service/organisation/${organisationId}/challenges`;
  },
  userJourney() {
    return `/user/journey`;
  },
  procurementPurchase() {
    return `/me-procurement-service/purchase`;
  },
  getlabels() {
    return `/criteria-service/label`;
  },
  putlabels() {
    return `/me-product-service/product/label-product`;
  },
  purchase() {
    return `/me-procurement-service/purchase`;
  },
  purchaseDetail(purchaseUuid: any) {
    return `/me-procurement-service/purchase/${purchaseUuid}/detail`;
  },
  questionnaire() {
    return `/me-questionnaire-service/questionnaire`;
  },
  getCategory() {
    return `/me-product-service/product-category`;
  },
  getFamily() {
    return `/me-product-service/family`;
  },
  purchaseConfirm(purchaseUuid: any) {
    return `/me-procurement-service/purchase/confirm/${purchaseUuid}`;
  },
  subCategoryCriteria(subCategoryId: any) {
    return `/criteria-service/criteria/brick/${subCategoryId}`;
  },
  allCriteria() {
    return `/criteria-service/criteria`;
  },
  getCriteriaLabels(criteriaId: any) {
    return `/criteria-service/label/criteria?id=${criteriaId}`;
  },
  createRecommendation() {
    return `/me-procurement-service/recommendation`;
  },
  getRecommendation(recommendationId: any) {
    return `/me-procurement-service/recommendation/${recommendationId}`;
  },
  getSuppliers(brickId: any) {
    return `/me-product-service/suppliers?brick=${brickId}`;
  },
  recommendationConfirm(recommendationId: any) {
    return `/me-procurement-service/recommendation/${recommendationId}/confirm`;
  },
};
