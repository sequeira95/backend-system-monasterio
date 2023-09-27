/*
  formateo del nombre de la coleccion
*/
export function formatCollectionName ({ enviromentEmpresa, enviromentCliente, nameCollection }) {
  if (enviromentCliente) {
    return `col_${enviromentEmpresa}_${enviromentCliente}_${nameCollection}`
  }
  return `col_${enviromentEmpresa}_${nameCollection}`
}
