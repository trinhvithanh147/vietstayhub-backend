const roomModel = require("../models/rooms.model");

const calculatePrice = (originalPrice, discountPercent) => {
  const safeOriginalPrice = Number(originalPrice) || 0;
  const safeDiscountPercent = Number(discountPercent) || 0;

  const finalPrice = safeOriginalPrice * (1 - safeDiscountPercent / 100);
  return Math.round(finalPrice);
};

const roomService = {
  getAll: async () => {
    return await roomModel.find().populate("property_id");
  },

  getByPropertyId: async (propertyId) => {
    return await roomModel.find({ property_id: propertyId });
  },

  create: async (data) => {
    const {
      property_id,
      name,
      room_type,
      description,
      original_price,
      discount_percent,
      capacity,
      quantity,
      bed_info,
      area,
      view,
      badges,
      amenities,
    } = data;

    const finalPrice = calculatePrice(original_price, discount_percent);

    const room = await roomModel.create({
      property_id,
      name,
      room_type,
      description,
      price: finalPrice,
      original_price: Number(original_price) || 0,
      discount_percent: Number(discount_percent) || 0,
      capacity: Number(capacity) || 1,
      quantity: Number(quantity) || 1,
      bed_info,
      area: Number(area) || 0,
      view,
      badges,
      amenities,
    });

    return room;
  },

  update: async (id, data) => {
    const nextData = { ...data };

    const originalPrice = Number(nextData.original_price) || 0;
    const discountPercent = Number(nextData.discount_percent) || 0;

    nextData.price = calculatePrice(originalPrice, discountPercent);
    nextData.original_price = originalPrice;
    nextData.discount_percent = discountPercent;
    nextData.capacity = Number(nextData.capacity) || 1;
    nextData.quantity = Number(nextData.quantity) || 1;
    nextData.area = Number(nextData.area) || 0;

    return await roomModel.findByIdAndUpdate(id, nextData, {
      new: true,
      runValidators: true,
    });
  },

  delete: async (id) => {
    return await roomModel.findByIdAndDelete(id);
  },
};

module.exports = roomService;
