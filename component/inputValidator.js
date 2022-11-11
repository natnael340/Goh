

const validate = (attributes) => {
  if (attributes.title && !/^[0-9a-zA-Z\ ]{3,64}$/g.test(attributes.title))
      return {
        status: false,
        message: "Invalid title"
      }
    else if (attributes.description && !/^[a-zA-Z0-9]{0,255}$/g.test(attributes.description))
      return {
        status: false,
        message: "Invalid first name"
      }
    else if (attributes.location && !/^[a-zA-Z0-9]{0,255}$/g.test(attributes.location))
      return {
        status: false,
        message: "Invalid first name"
      }
    else if (attributes.size && !/^[0-9x]{0,255}$/g.test(attributes.size))
      return {
        status: false,
        message: "Invalid size"
      }
    else if (attributes.category && attributes.category && (!/^[a-zA-Z]{9,20}$/g.test(attributes.category) || !["Apartment", "Condominium", "Shared Area", "Full Area"].includes(attributes.category)))
      return {
        status: false,
        message: "Invalid category"
      }
    else if (attributes.status && attributes.status && (!/^[a-zA-Z]{6,10}$/g.test(attributes.status) || !["available", "occupied", "pending"].includes(attributes.status)))
      return {
        status: false,
        message: "Invalid status"
      }
    else if (attributes.locationType && attributes.locationType && (!/^[a-zA-Z]{6,10}$/g.test(attributes.locationType) || !["map", "raw"].includes(attributes.locationType)))
      return {
        status: false,
        message: "Invalid location type"
      }
    else if (attributes.contactName && !/^[a-zA-Z]{0,}$/g.test(attributes.contactName))
      return {
        status: false,
        message: "Invalid contact name"
      }
    else if (attributes.contactEmail && attributes.contactEmail != "" && !/^[a-z0-9]{1,32}\@[a-z]{2,32}\.[a-z]{1,6}$/g.test(attributes.contactEmail))
      return {
        status: false,
        message: "Invalid contact email"
      }
  else return {status: true}
}

module.exports = {validate}