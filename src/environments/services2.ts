export const services = {
  login() {
    return '/login';
  },
  forgottenPassword() {
    return '/forgottenPassword';
  },
  authenticatetfa() {
    return '/authenticatetfa';
  },
  currentUser() {
    return '/user/current';
  },
  inflowsandOutflofList(id: string, type: string, page: number, size: number) {
    return `/unit/${id}/category/${type}/list?page=${page}&size=${size}`;
  },
  invitedFlowList(page: number, size: number) {
    return `/cti/material/listInvited?page=${page}&size=${size}`;
  },
  energy(id: string) {
    return `/cti/unit/${id}/energyUsage`;
  },
  productSummary(id: any, summary: any) {
    return `/product/${id}?summary=${summary}`;
  },
  productDetail(id: any, summary: any) {
    return `/product/${id}?summary=${summary}`;
  },
  ctiQuestion(id: string) {
    return `/questionnaire/${id}/categories/Product%20Details?dynamic=true`;
  },
  ctiQuestionsSave(id: string) {
    return `/cti/material/${id}/save`;
  },
  ctiQuestionsPublish(id: string) {
    return `/cti/material/${id}/authorize`;
  },
  getUnit() {
    return `/unit`;
  },
  unitWithUnitId(unitId: string) {
    return `/unit/${unitId}`;
  },
  unitDetail(id: string) {
    return `/unit/${id}/details`;
  },
  unitEdit(id: string) {
    return `/unit/${id}`;
  },
  loopEdit(id: string) {
    return `/cti/unit/${id}/loop`;
  },
  addMaterial(unitId: string, type: string) {
    return `/cti/unit/${unitId}/category/${type}/add`;
  },
  suppliers(page: any) {
    return `/suppliers?page=${page}`;
  },
  addSuppliers(unitId: string, type: string) {
    return `/cti/unit/${unitId}/category/${type}/addSupplier`;
  },
  guidance() {
    return `/guidance`;
  },
  ctiGuidance() {
    return `/cti/guidance`;
  },
  ctiUnitGuidance(unitId: string) {
    return `/cti/unit/${unitId}/guidance`;
  },
  companyAdmin() {
    return `/user/role/Company%20admin`;
  },
  productManager() {
    return `/user/role/Product%20manager`;
  },
  dataEntryUser() {
    return `/user/role/Data%20entry%20user`;
  },
  responsible(materialId: string) {
    return `/cti/material/${materialId}/responsible`;
  },
  organisation() {
    return `/organisation`;
  },
  organisationDetails() {
    return `/organisation/details`;
  },
  removeMaterial(unitId: string, type: string, productId: any) {
    return `/unit/${unitId}/category/${type}/product/${productId}`;
  },
  emailCheck(email: string) {
    return `/user/${email}`;
  },
  emailCheckForSupplier(email: string) {
    return `/suppliers/user/${email}`;
  },
  newSupplier(unitId: string, type: string) {
    return `/cti/unit/${unitId}/category/${type}/addSupplier`;
  },
  productivity(unitId: string) {
    return `/cti/unit/${unitId}/productivity`;
  },
  paticaToken() {
    return `/patica/token `;
  },
  graph(unitId: string) {
    return `/cti/unit/${unitId}/graph`;
  },
  critical(unitId: string) {
    return `/cti/unit/${unitId}/critical`;
  },
  upload() {
    return `/assets/upload`;
  },
  importUnitProduct(unitId: string) {
    return `/import/unit/${unitId}/product`;
  },
  token(token: string) {
    return `/token/${token}`;
  },
  setPassword() {
    return `/setPassword`;
  },
  unitReport(unitId: string) {
    return `/cti/unit/${unitId}/report`;
  },
  unitExport(unitId: string) {
    return `/export/unit/${unitId}/products`;
  },
  uploadEveidance() {
    return `/assets/uploadPermanent?folder=evidence`;
  },
  questionnaireWithEvidence(id: string) {
    return `/cti/material/${id}/saveEvidence`;
  },
  improvementList(unitId: string, type: string) {
    return `/unit/${unitId}/category/${type}/improvementList`;
  },
  calculateImprovement(unitId: string, category: string) {
    return `/cti/unit/${unitId}/category/${category}/calculateImprovement`;
  },
  improvement(unitId: string, category: string) {
    return `/cti/unit/${unitId}/category/${category}/improvement`;
  },
  step6AllFlowProperties() {
    return `/cti/getAllFlowProperties`;
  },
  getFlowStrategies(unitId: string) {
    return `/cti/getFlowStrategies/unit/${unitId}`;
  },
  saveFlowStrategies(unitId: string) {
    return `/cti/saveFlowStrategies/unit/${unitId}`;
  },
  saveFlowSolution(unitId: string) {
    return `/cti/saveFlowSolution/unit/${unitId}`;
  },
  saveBusinessCase(unitId: string) {
    return `/cti/saveBusinessCase/unit/${unitId}`;
  },
  resendSingup() {
    return `/signup/resend`;
  },
  getStrategyChecklist(unitId: string) {
    return `/cti/getStrategyChecklist/unit/${unitId}`;
  },
  saveStrategyChecklist(unitId: string) {
    return `/cti/saveStrategyChecklist/unit/${unitId}`;
  },
  errorPatica() {
    return '/patica/error';
  },
  productsList(
    pageIndex: Number,
    pageSize: Number,
    direction: String,
    active: String
  ) {
    if (direction === null || active === null) {
      return `/product?page=${pageIndex}&pageSize=${pageSize}`;
    } else {
      return `/product?order=${direction}&page=${pageIndex}&sort=${active}`;
    }
  },

  addProduct() {
    return `/product`;
  },
  addProductCSV() {
    return `/assets/upload`;
  },
  uploadCSV() {
    return `/import/product`;
  },
  productNameList() {
    return `/product?onlyName=true`;
  },
  cloneProduct(id: any) {
    return `/product/${id}`;
  },

  suppliersList(
    pageIndex?: Number,
    pageSize?: Number,
    direction?: String,
    active?: String
  ) {
    return `/suppliers`;
  },
  supplierDetail(id: any) {
    return `/suppliers/${id}`;
  },
  usersOfSupplier(id: any) {
    return `/suppliers/${id}/users`;
  },
  userDetail(email: any) {
    return `/user/${email}`;
  },
  createSuppliers(id: any, isNewUser: boolean) {
    return `/invitations/product/${id}?isNewUser=${isNewUser}`;
  },
  questionnaireForm(id: any, cat: any) {
    return `/questionnaire/${id}/categories/${cat}?dynamic=true`;
  },
  putQuestionnaireForm(id: any) {
    return `/questionnaire/${id}?dynamic=true`;
  },
  filter() {
    return `/filter`;
  },
  users(page: any) {
    return `/user?page=${page}`;
  },
  user() {
    return `/user`;
  },
  userRole(email: any) {
    return `/user/${email}/role`;
  },
  bomList(pageIndex?: Number, pageSize?: Number, direction?: String, id?: any) {
    return `/product/${id}/bom`;
  },
  deleteBom(productId: string, bomId: string) {
    return `/product/${productId}/bom/${bomId}/remove`;
  },
  editBom(productId: string, bomId: string) {
    return `/product/${productId}/bom/${bomId}`;
  },
  updateBomProperties(productId: string, bomId: string) {
    return `/product/${productId}/bom/properties/${bomId}`;
  },
  createBom(productId: string, isGenericMaterial: string) {
    return `/product/${productId}/bom/${isGenericMaterial}`;
  },
  createBomComponent(productId: string) {
    return `/product/${productId}/bom`;
  },
  bomListOther(productId: string) {
    return `/product/${productId}/bom/listOther`;
  },
  assetsUpload() {
    return `/assets/upload`;
  },
  imageDownload(fileName: any) {
    return `/assets/download/${fileName}`;
  },
  productPermissions(productId: string) {
    return `/product/${productId}/permissions`;
  },
  invitationsProduct(productId: string, isNewUser: boolean) {
    return `/invitations/product/${productId}?isNewUser=${isNewUser}`;
  },
  checkEmail(email: string) {
    return `/suppliers/user/${email}`;
  },
  delegate(productId: string) {
    return `/invitations/product/${productId}/delegate`;
  },
  featuresOrganisation(orgId: string) {
    return `/features/organisation/${orgId}`;
  },
  adminSettings(orgId: string, feature: any, status: string) {
    return `/admin/organisation/${orgId}/feature/${feature}/status/${status}`;
  },
  reportStatus(unitId: string) {
    return `/cti/unit/${unitId}/reportStatus`;
  },
  password() {
    return `/user/password`;
  },
  columns(lens: string) {
    return `/question-service/question/columns/${lens}`;
  },
  spreadsheet(productId: string) {
    return `/product-service/product/spreadsheet/${productId}`;
  },
  getSpreadsheet(spreadsheetUuid: string) {
    return `/csvimport-service/spreadsheet/${spreadsheetUuid}`;
  },
  spreadsheetRowEdit() {
    return `/csvimport-service/spreadsheet/row`;
  },
  spreadsheetCreate() {
    return `/csvimport-service/spreadsheet`;
  },
  spreadsheetInsertingNewRow(spreadsheetUuid: string) {
    return `/csvimport-service/spreadsheet/row/${spreadsheetUuid}`;
  },
  lenses() {
    return `/question-repository/lenses`;
  },
  spreadsheetId(productUuid: string) {
    return `/csvimport-service/spreadsheet/product/${productUuid}`;
  },
  ecocost(productUuid: string) {
    return `/calculation-service/circularity/product/${productUuid}/ecocost`;
  },
  improvementQuestiont(unitId: string, category: string) {
    return `/cti/unit/${unitId}/category/${category}/improvementQuestion`;
  },

  step6Question(unitId: string, category: string) {
    return `/cti/unit/${unitId}/category/${category}/step6`;
  },
  step7SamartTarget(unitId: string) {
    return `/cti/unit/${unitId}/step7`;
  },
  questionList() {
    return `/question-service/question/list`;
  },
  answers(questionnaireuUuid: string) {
    return `/questionnaire/${questionnaireuUuid}/answers`;
  },
  publishSpreasheet(spreadsheetUuid: string) {
    return `/csvimport-service/spreadsheet/authorize/${spreadsheetUuid}`;
  },
  authorizeProduct(productUuid: string) {
    return `/product-service/product/authorize/product/${productUuid}`;
  },
  adminOrganisation() {
    return `/admin/organisation`;
  },
  isReadySpreadsheet(spreadsheetUuid: string) {
    return `/csvimport-service/spreadsheet/isReady/spreadsheet/${spreadsheetUuid}`;
  },
  removeProject(productUuid: any) {
    return `/product/${productUuid}`;
  },
  ctiStep2Inicators(unitId: string) {
    return `/cti/unit/${unitId}/indicators`;
  },
  unitDetailed(unitId: string) {
    return `/cti/unit/${unitId}/detailed`;
  },
  unitWater(unitId: string) {
    return `/cti/unit/${unitId}/water`;
  },
  unitOnsiteWater(unitId: string) {
    return `/cti/unit/${unitId}/onsiteWater`;
  },
  unitGraph(unitId: string) {
    return `/cti/unit/${unitId}/graph`;
  },
  energyImprovement(unitId: string) {
    return `/cti/unit/${unitId}/energyImprovement`;
  },
  waterImprovement(unitId: string) {
    return `/cti/unit/${unitId}/waterImprovement`;
  },
  listBusinessLevels() {
    return `/businessLevel`;
  },
  addAssessment(businessLevelID: string) {
    return `/businessLevel/${businessLevelID}/assessment`;
  },
  getAssessment(assessmentId: string) {
    return `/businessLevel/assessment/${assessmentId}`;
  },
  getCTIProDashboard() {
    return `/businessLevel/dashboard`;
  },
  deleteBusinessLevel(businessLevelID: string) {
    return `/businessLevel/${businessLevelID}`;
  },
  editBusinessLevel(businessLevelID: string) {
    return `/businessLevel/${businessLevelID}`;
  },
  getUnitBusinessLevel(unitId: string) {
    return `/businessLevel/byUnit/${unitId}`;
  },
  membersOfBusinessLevel(businessLevelID: string) {
    return `/businessLevel/${businessLevelID}/member`;
  },
  removeMembersOfBusinessLevel(businessLevelID: string, userId: string) {
    return `/businessLevel/${businessLevelID}/member/${userId}`;
  },
  compareBusiness() {
    return `/businessLevel/compare`;
  },
  aggregateBusiness() {
    return `/businessLevel/aggregate`;
  },
};
