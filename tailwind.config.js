module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        '2': 'repeat(2, minmax(0, 1fr))', // Đảm bảo cấu hình đúng
      },
    },
  },
};