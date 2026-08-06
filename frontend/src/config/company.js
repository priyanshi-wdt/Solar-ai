const params = new URLSearchParams(window.location.search);

export const companyId = params.get("companyId");
export const icon = params.get("imageSrc");

console.log("Company:", companyId);
console.log("Icon:", icon);