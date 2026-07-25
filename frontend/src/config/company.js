const params = new URLSearchParams(
    window.location.search
);


export const companyId =
    params.get("companyId");


console.log(
    "Company:",
    companyId
);