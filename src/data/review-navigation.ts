import { url } from './site';

export const reviewSearchEntries = [
  { title: 'Bảng so sánh công ty chứng khoán', description: 'Tra cứu phí cổ phiếu, lãi margin, phí phái sinh và ứng trước, kèm nguồn và điều kiện.', path: '/reviews/' },
  { title: 'So sánh 2 hoặc 3 công ty chứng khoán', description: 'Chọn công ty chứng khoán để đặt chi phí và điều kiện cạnh nhau.', path: '/reviews/so-sanh/' },
].map((entry) => ({
  title: entry.title, description: entry.description, category: 'reviews', categoryLabel: 'Reviews',
  readingTime: 'Tra cứu', updatedDate: 'Theo nguồn từng mức phí', tags: ['so sánh', 'biểu phí', 'margin'],
  href: url(entry.path), text: `${entry.title} ${entry.description} reviews`.toLowerCase(),
}));
