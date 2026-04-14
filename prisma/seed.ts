import { db } from '../src/lib/db'

async function main() {
  console.log('🌱 Seeding MindForge Academy...')

  // Clean existing data
  await db.quiz.deleteMany()
  await db.userProgress.deleteMany()
  await db.lesson.deleteMany()
  await db.module.deleteMany()
  await db.skillPath.deleteMany()
  await db.userStats.deleteMany()
  await db.dailyChallenge.deleteMany()
  await db.badge.deleteMany()
  await db.userNote.deleteMany()
  await db.studySession.deleteMany()

  // ==================== BADGES ====================
  await db.badge.createMany({
    data: [
      { name: 'Khởi đầu hoàn hảo', description: 'Hoàn thành bài học đầu tiên', icon: '🌟', condition: JSON.stringify({ type: 'lessons_completed', count: 1 }), xpReward: 50, earnedAt: new Date() },
      { name: 'Nhà tư duy', description: 'Hoàn thành 3 bài học', icon: '🧠', condition: JSON.stringify({ type: 'lessons_completed', count: 3 }), xpReward: 150, earnedAt: new Date() },
      { name: 'Siêu phản biện', description: 'Đạt điểm 100% trên bất kỳ quiz nào', icon: '⚡', condition: JSON.stringify({ type: 'perfect_quiz' }), xpReward: 200, earnedAt: null },
      { name: 'Học đều đặn', description: 'Chuỗi 7 ngày học liên tiếp', icon: '🔥', condition: JSON.stringify({ type: 'streak', days: 7 }), xpReward: 300, earnedAt: null },
      { name: 'Bậc thầy hệ thống', description: 'Hoàn thành Tư duy hệ thống', icon: '🔄', condition: JSON.stringify({ type: 'complete_path', slug: 'tu-duy-he-thong' }), xpReward: 500, earnedAt: null },
      { name: 'Bậc thầy AI', description: 'Hoàn thành Quản trị AI', icon: '🤖', condition: JSON.stringify({ type: 'complete_path', slug: 'quan-tri-ai' }), xpReward: 500, earnedAt: null },
      { name: 'Nhà chiến lược', description: 'Hoàn thành Tư duy chiến lược', icon: '♟️', condition: JSON.stringify({ type: 'complete_path', slug: 'tu-duy-chien-luoc' }), xpReward: 500, earnedAt: null },
      { name: 'Siêu học giả', description: 'Chuỗi 30 ngày học liên tiếp', icon: '💎', condition: JSON.stringify({ type: 'streak', days: 30 }), xpReward: 1000, earnedAt: null },
      { name: 'Kho tàng tri thức', description: 'Hoàn thành 50 bài học', icon: '📚', condition: JSON.stringify({ type: 'lessons_completed', count: 50 }), xpReward: 800, earnedAt: null },
      { name: 'Bậc thầy toàn diện', description: 'Hoàn thành cả 4 lộ trình', icon: '👑', condition: JSON.stringify({ type: 'complete_all' }), xpReward: 2000, earnedAt: null },
    ],
  })

  // ==================== USER STATS ====================
  await db.userStats.create({
    data: { totalXP: 0, level: 1, currentStreak: 0, longestStreak: 0, lessonsCompleted: 0, quizzesTaken: 0, totalTimeMinutes: 0 },
  })

  // ==================== SKILL PATH 1: TƯ DUY HỆ THỐNG ====================
  const sp1 = await db.skillPath.create({
    data: {
      title: 'Tư duy hệ thống', slug: 'tu-duy-he-thong', order: 1,
      description: 'Học cách nhìn nhận vấn đề dưới góc độ tổng thể, hiểu các mối quan hệ và phụ thuộc lẫn nhau giữa các thành phần trong một hệ thống phức tạp.',
      icon: '🔄', color: 'emerald',
      modules: {
        create: [
          {
            title: 'Nhận diện hệ thống', description: 'Hiểu cơ bản về hệ thống và cách nhận diện chúng trong cuộc sống', order: 1,
            lessons: {
              create: [
                {
                  title: 'Tư duy hệ thống là gì?',
                  content: `# Tư duy hệ thống là gì?\n\n## Định nghĩa\n\n**Tư duy hệ thống** (Systems Thinking) là cách tiếp cận vấn đề bằng cách xem xét **toàn bộ hệ thống** thay vì chỉ tập trung vào từng phần riêng lẻ. Nó giúp chúng ta hiểu các **mối quan hệ**, **vòng lặp phản hồi** và **mô hình hành vi**.\n\n## Tại sao cần tư duy hệ thống?\n\nTrong thế giới phức tạp, các vấn đề luôn liên kết với nhau. Giải pháp cho một phần thường tạo ra hệ lụy cho phần khác.\n\n> "Hôm nay các vấn đề đến từ ngày hôm qua các giải pháp." — Michael Fullan\n\n## 5 khái niệm nền tảng\n\n### 1. Hệ thống (System)\nTập hợp các thành phần tương tác để tạo ra kết quả mà không phần đơn lẻ nào đạt được.\n\n### 2. Các thành phần (Elements)\nNhững phần có thể nhìn thấy — con người, quy trình, công nghệ, tài nguyên.\n\n### 3. Sự kết nối (Interconnections)\nMối quan hệ và luồng thông tin, năng lượng, tài nguyên giữa các thành phần.\n\n### 4. Mục đích (Purpose)\nMục tiêu mà hệ thống hướng tới — thường không được nói rõ nhưng luôn tồn tại.\n\n### 5. Vòng lặp phản hồi (Feedback Loops)\nCơ chế mà kết quả của hành động quay lại ảnh hưởng đến chính hành động đó.\n\n## Ví dụ thực tế\n\nMột **doanh nghiệp** là một hệ thống với:\n- **Thành phần**: Nhân viên, sản phẩm, khách hàng, máy móc\n- **Kết nối**: Luồng thông tin, quy trình làm việc, chuỗi cung ứng\n- **Mục đích**: Tạo lợi nhuận và giá trị cho xã hội\n- **Vòng lặp**: Khách hàng hài lòng → Doanh thu tăng → Đầu tư thêm → Sản phẩm tốt hơn`,
                  keyTakeaways: JSON.stringify(['Tư duy hệ thống nhìn tổng thể thay vì từng phần riêng lẻ', 'Mọi hệ thống có 3 đặc điểm: thành phần, kết nối và mục đích', 'Vòng lặp phản hồi là cơ chế cốt lõi của mọi hệ thống', 'Giải pháp từng phần thường tạo ra vấn đề mới']),
                  order: 1, estimatedMinutes: 15,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Tư duy hệ thống là cách tiếp cận vấn đề bằng cách nào?', options: JSON.stringify(['Tập trung vào từng phần riêng lẻ', 'Xem xét toàn bộ hệ thống và các mối quan hệ', 'Chỉ phân tích nguyên nhân trực tiếp', 'Áp dụng quy trình tuyến tính cố định']), correctAnswer: 'Xem xét toàn bộ hệ thống và các mối quan hệ', explanation: 'Tư duy hệ thống nhìn nhận vấn đề dưới góc độ tổng thể, xem xét các mối quan hệ và phụ thuộc.', order: 1 },
                      { type: 'scenario', question: 'Một công ty giảm chi phí nhân sự → nhân viên còn lại làm thêm giờ → chất lượng giảm → khách hàng rời đi → doanh thu giảm → lại cắt nhân sự. Đây là ví dụ về loại vòng lặp nào?', options: JSON.stringify(['Vòng lặp cân bằng', 'Vòng lặp tăng cường', 'Vòng lặp ngẫu nhiên', 'Không phải vòng lặp phản hồi']), correctAnswer: 'Vòng lặp tăng cường', explanation: 'Đây là vòng lặp tăng cường tiêu cực (vicious cycle) — mỗi bước lại tăng cường tác động của bước trước.', order: 2 },
                    ],
                  },
                },
                {
                  title: 'Các thành phần và ranh giới hệ thống',
                  content: `# Các thành phần và ranh giới hệ thống\n\n## Phân tích cấu trúc hệ thống\n\nMọi hệ thống đều có 3 lớp:\n\n### Lớp 1: Sự kiện (Events)\n- Phản ứng với những gì đang xảy ra\n- "Ai làm sai?", "Xảy ra chuyện gì?"\n- **Cách tư duy phản ứng, hiệu quả ngắn hạn**\n\n### Lớp 2: Mô hình hành vi (Patterns)\n- Nhận biết các khuôn mẫu lặp lại\n- "Tại sao điều này lại tiếp tục xảy ra?"\n- **Bắt đầu thấy bức tranh lớn hơn**\n\n### Lớp 3: Cấu trúc hệ thống (Systemic Structure)\n- Hiểu các lực lượng tạo ra mô hình hành vi\n- "Cấu trúc nào khiến điều này xảy ra?"\n- **Tư duy hệ thống thực sự bắt đầu ở đây**\n\n## Ranh giới hệ thống (Boundaries)\n\nRanh giới quyết định những gì nằm **trong** và **ngoài** hệ thống. Việc xác định sai ranh giới là lỗi phổ biến nhất.\n\n### Nguyên tắc xác định ranh giới:\n1. **Bao gồm đủ** các yếu tố ảnh hưởng đến vấn đề\n2. **Loại bỏ** những yếu tố tác động quá nhỏ\n3. **Ranh giới không cố định** — cần điều chỉnh khi hiểu sâu hơn\n\n## Môi trường hệ thống\n\nTất cả những gì nằm ngoài ranh giới nhưng vẫn tác động đến hệ thống:\n- **Luật pháp, quy định** ảnh hưởng đến doanh nghiệp\n- **Văn hóa xã hội** ảnh hưởng đến giáo dục\n- **Thị trường quốc tế** ảnh hưởng đến kinh tế nội địa`,
                  keyTakeaways: JSON.stringify(['3 lớp tư duy: Sự kiện → Mô hình → Cấu trúc', 'Ranh giới hệ thống cần được xác định cẩn thận', 'Môi trường bên ngoài vẫn tác động đến hệ thống', 'Thay đổi cấu trúc hệ thống là cách giải quyết triệt để nhất']),
                  order: 2, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Cấp độ tư duy hệ thống sâu nhất là gì?', options: JSON.stringify(['Phân tích cấu trúc hệ thống', 'Thay đổi mental models', 'Nhận biết mô hình hành vi', 'Phản ứng với sự kiện']), correctAnswer: 'Thay đổi mental models', explanation: 'Thay đổi Mental Models là cấp độ sâu nhất, nơi chúng ta thay đổi niềm tin và giả định nền tảng.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Vòng lặp phản hồi', description: 'Hiểu về vòng lặp tăng cường và cân bằng trong hệ thống', order: 2,
            lessons: {
              create: [
                {
                  title: 'Vòng lặp tăng cường (Reinforcing Loops)',
                  content: `# Vòng lặp tăng cường (Reinforcing Loops)\n\n## Định nghĩa\n\nVòng lặp tăng cường là cơ chế trong đó một hành động tạo ra kết quả, và kết quả đó lại **củng cố** hành động ban đầu, tạo ra **hiệu ứng nối tiếp**.\n\n## Đặc điểm\n\n- Có thể là **tích cực** (tốt) hoặc **tiêu cực** (xấu)\n- Tạo ra **tăng trưởng theo cấp số nhân** (exponential)\n- Không tự dừng — cần vòng lặp cân bằng để kiểm soát\n\n## Vòng lặp tích cực\n\n**Hiệu ứng lây lan cảm xúc tích cực:**\n- Bắt đầu hành động tốt → Cảm thấy tự hào → Tiếp tục hành động → Kết quả tốt hơn → Tự tin tăng → Hành động mạnh mẽ hơn\n\n**Phát triển kỹ năng:**\n- Học thêm → Kỹ năng tốt hơn → Cảm thấy hứng thú → Học thêm nữa → Kỹ năng càng tốt\n\n## Vòng lặp tiêu cực\n\n**Spiral đi xuống:**\n- Mất việc → Lo lắng → Ít tập trung → Phỏng vấn kém → Không tìm được việc → Lo lắng thêm\n\n**Nợ nần:**\n- Nợ tăng → Lãi tăng → Nợ càng tăng → Gặp khó khăn trả → Nợ càng lớn hơn\n\n## Cách phá vỡ vòng lặp tiêu cực\n\n1. **Nhận diện** vòng lặp đang diễn ra\n2. **Tìm điểm can thiệp** — nơi có thể chặn vòng lặp\n3. **Đưa vào yếu tố mới** — ví dụ: nhờ chuyên gia tư vấn, thay đổi môi trường\n4. **Xây dựng vòng lặp tích cực thay thế**`,
                  keyTakeaways: JSON.stringify(['Vòng lặp tăng cường tạo hiệu ứng nối tiếp', 'Có thể tích cực (tốt) hoặc tiêu cực (xấu)', 'Không tự dừng — cần kiểm soát', 'Phá vỡ bằng cách nhận diện, can thiệp và xây dựng vòng lặp mới']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Vòng lặp tăng cường có đặc điểm gì?', options: JSON.stringify(['Tự động dừng khi đạt mục tiêu', 'Tạo ra tăng trưởng theo cấp số nhân', 'Luôn mang lại kết quả tích cực', 'Chỉ tồn tại trong kinh doanh']), correctAnswer: 'Tạo ra tăng trưởng theo cấp số nhân', explanation: 'Vòng lặp tăng cường tạo ra hiệu ứng nối tiếp, dẫn đến tăng trưởng theo cấp số nhân (exponential growth).', order: 1 },
                    ],
                  },
                },
                {
                  title: 'Vòng lặp cân bằng (Balancing Loops)',
                  content: `# Vòng lặp cân bằng (Balancing Loops)\n\n## Định nghĩa\n\nVòng lặp cân bằng là cơ chế giúp hệ thống **duy trì ổn định** bằng cách điều chỉnh hành động để đạt được mục tiêu.\n\n## Đặc điểm\n\n- Đóng vai trò như **"nhiệt kế"** của hệ thống\n- Tự động điều chỉnh để **quay về trạng thái cân bằng**\n- Tạo ra **hành vi ổn định** trong dài hạn\n\n## Ví dụ thực tế\n\n### 1. Điều hòa nhiệt độ\n- Phòng nóng → Điều hòa bật → Phòng mát → Điều hòa tắt → Phòng lại nóng → Lặp lại\n\n### 2. Quản lý thời gian\n- Nhiều việc → Cảm thấy quá tải → Ưu tiên → Giảm việc → Vừa sức → Lại nhận thêm việc\n\n### 3. Giá cả thị trường\n- Nhu cầu cao → Giá tăng → Nhu cầu giảm → Giá giảm → Nhu cầu tăng → Lặp lại\n\n## Cách nhận diện vòng lặp cân bằng\n\n1. Tìm **mục tiêu** hoặc **mức mong muốn**\n2. Xác định **sự chênh lệch** giữa thực tế và mục tiêu\n3. Tìm **hành động điều chỉnh** khi có chênh lệch\n\n## Tương tác giữa hai loại vòng lặp\n\nHầu hết hệ thống thực tế có **cả hai loại vòng lặp** hoạt động cùng lúc:\n- Vòng lặp tăng cường tạo **sự thay đổi**\n- Vòng lặp cân bằng tạo **sự ổn định**\n- **Cân bằng** giữa hai loại quyết định hành vi tổng thể của hệ thống`,
                  keyTakeaways: JSON.stringify(['Vòng lặp cân bằng giúp duy trì ổn định', 'Luôn có mục tiêu hoặc mức mong muốn', 'Hoạt động như "nhiệt kế" điều chỉnh hệ thống', 'Hầu hết hệ thống có cả tăng cường và cân bằng']),
                  order: 2, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'scenario', question: 'Khi bạn đặt báo thức 6h sáng → Dậy trễ 1 ngày → Buồn ngủ cả ngày → Đi ngủ sớm hơn → Hôm sau dậy đúng giờ → Duy trì lịch trình. Đây là vòng lặp gì?', options: JSON.stringify(['Vòng lặp tăng cường', 'Vòng lặp cân bằng', 'Không phải vòng lặp phản hồi', 'Vòng lặp hỗn hợp']), correctAnswer: 'Vòng lặp cân bằng', explanation: 'Hệ thống tự điều chỉnh để đạt mục tiêu (dậy đúng 6h) — đây là đặc điểm của vòng lặp cân bằng.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Sơ đồ nhân quả', description: 'Công cụ trực quan hóa mối quan hệ trong hệ thống', order: 3,
            lessons: {
              create: [
                {
                  title: 'Causal Loop Diagrams (CLD)',
                  content: `# Causal Loop Diagrams (CLD)\n\n## CLD là gì?\n\n**Sơ đồ nhân quả vòng** (CLD) là công cụ trực quan giúp:\n- Xác định các **biến số quan trọng**\n- Hiểu **mối quan hệ nhân quả**\n- Nhận biết **vòng lặp phản hồi**\n\n## Cách đọc CLD\n\n### Các ký hiệu:\n- **Mũi tên (→)**: Yếu tố A ảnh hưởng đến B\n- **Dấu (+)**: Cùng chiều — A tăng thì B tăng\n- **Dấu (-)**: Ngược chiều — A tăng thì B giảm\n\n### Quy tắc xác định loại vòng lặp:\n- **Chẵn** số dấu (-) → **Vòng lặp tăng cường**\n- **Lẻ** số dấu (-) → **Vòng lặp cân bằng**\n\n## Bước tạo CLD\n\n### Bước 1: Xác định vấn đề\nChọn biến số chính cần phân tích.\n\n### Bước 2: Liệt kê biến liên quan\nNhững yếu tố nào ảnh hưởng hoặc bị ảnh hưởng?\n\n### Bước 3: Xác định hướng\n- **Cùng chiều (+)**: A tăng → B tăng\n- **Ngược chiều (-)**: A tăng → B giảm\n\n### Bước 4: Tìm vòng lặp\nKết nối các mũi tên thành vòng hoàn chỉnh.\n\n## Ví dụ: Vòng lặp học tập\n\n\`\`\`\nNỗ lực học → Hiểu bài (+) → Kết quả tốt (+) → Tự tin (+) → Nỗ lực học\n\`\`\`\n\nĐếm dấu (-): 0 (chẵn) → **Vòng lặp tăng cường tích cực**\n\n## Ví dụ: Quản lý cân nặng\n\n\`\`\`\nCân nặng → Muốn giảm (-) → Ăn kiêng → Cân nặng giảm → Ít muốn kiêng hơn\n\`\`\`\n\nĐếm dấu (-): 1 (lẻ) → **Vòng lặp cân bằng**`,
                  keyTakeaways: JSON.stringify(['CLD trực quan hóa mối quan hệ nhân quả', 'Dấu (+) = cùng chiều, dấu (-) = ngược chiều', 'Chẵn dấu (-) = tăng cường, lẻ dấu (-) = cân bằng', 'Bắt đầu từ biến số chính và mở rộng dần']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Trong CLD, nếu vòng lặp có 3 dấu (-), đó là loại vòng lặp nào?', options: JSON.stringify(['Vòng lặp tăng cường', 'Vòng lặp cân bằng', 'Không xác định được', 'Vòng lặp hỗn hợp']), correctAnswer: 'Vòng lặp tăng cường', explanation: 'Số lẻ dấu (-) → vòng lặp tăng cường. Số chẵn dấu (-) → vòng lặp cân bằng. 3 là lẻ nên là tăng cường.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Hiệu ứng trễ trong hệ thống', description: 'Hiểu về delay và cách nó ảnh hưởng đến hành vi hệ thống', order: 4,
            lessons: {
              create: [
                {
                  title: 'Delay (Hiệu ứng trễ) trong hệ thống',
                  content: `# Delay (Hiệu ứng trễ) trong hệ thống\n\n## Delay là gì?\n\n**Delay** là khoảng thời gian giữa khi một hành động được thực hiện và khi kết quả của nó xuất hiện. Đây là nguyên nhân chính khiến chúng ta **đánh giá sai** tình huống.\n\n## Các loại delay\n\n### 1. Delay vật lý\n- Thời gian vận chuyển hàng hóa\n- Thời gian xây dựng nhà cửa\n- Thời gian đào tạo nhân viên\n\n### 2. Delay nhận thức\n- Thời gian nhận biết vấn đề\n- Thời gian hiểu tác động\n- Thời gian thay đổi thói quen\n\n### 3. Delay phản ứng\n- Thời gian từ khi quyết định đến khi thực hiện\n- Thời gian từ phản hồi đến điều chỉnh\n\n## Tại sao delay nguy hiểm?\n\n**Sự cố "Quá muộn và Quá nhiều":**\n1. Hành động nhưng không thấy kết quả ngay\n2. Tiếp tục hành động vì nghĩ "chưa đủ"\n3. Kết quả xuất hiện **đột ngột và quá mức**\n4. Phản ứng quá mạnh → Tạo ra vấn đề ngược\n\n### Ví dụ kinh điển: Tắm nước nóng\n- Nước lạnh → Mở vòi nóng\n- Không thấy nóng ngay → Mở to hơn\n- Đột ngột nước quá nóng → Tắt hẳn\n- Lại quá lạnh → Mở lại... (vòng lặp dao động)\n\n## Cách quản lý delay\n\n1. **Nhận diện** delay trong hệ thống\n2. **Kiên nhẫn** — không phản ứng quá sớm\n3. **Theo dõi xu hướng** thay vì giá trị khoảnh khắc\n4. **Sử dụng mô hình** để dự đoán kết quả tương lai`,
                  keyTakeaways: JSON.stringify(['Delay là nguyên nhân chính của quyết định sai lầm', '3 loại: vật lý, nhận thức, phản ứng', '"Quá muộn và quá nhiều" là cạm bẫy phổ biến', 'Cần kiên nhẫn và theo dõi xu hướng dài hạn']),
                  order: 1, estimatedMinutes: 15,
                  quizzes: {
                    create: [
                      { type: 'scenario', question: 'Bạn bắt đầu tập gym nhưng 2 tuần đầu không thấy thay đổi trên cân. Bạn nản chí và bỏ cuộc. Đây là lỗi gì?', options: JSON.stringify(['Lười biếng', 'Không hiểu về delay trong hệ thống cơ thể', 'Ăn không đủ', 'Tập sai phương pháp']), correctAnswer: 'Không hiểu về delay trong hệ thống cơ thể', explanation: 'Cơ thể cần thời gian để phản ứng với việc tập luyện. Delay nhận thức khiến chúng ta nản chí trước khi kết quả xuất hiện.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Mental Models', description: 'Các mô hình tư duy phổ biến giúp phân tích vấn đề', order: 5,
            lessons: {
              create: [
                {
                  title: 'First Principles Thinking (Tư duy nguyên lý đầu)',
                  content: `# First Principles Thinking\n\n## Khái niệm\n\n**Tư duy nguyên lý đầu** là phương pháp phân tích vấn đề bằng cách **tháo rời** nó thành các **sự thật cơ bản nhất** không thể phủ nhận, sau đó xây dựng lại từ những nền tảng đó.\n\n## Tại sao cần First Principles?\n\n- **Tránh tư duy theo analog**: "Ai khác cũng làm vậy" không phải lý do hợp lý\n- **Tìm ra giải pháp đột phá**: Khi bắt đầu từ cơ bản, bạn thấy những khả năng người khác bỏ qua\n- **Hiểu sâu hơn**: Biết TẠI SAO điều gì hoạt động, không chỉ THẾ NÀO\n\n## 5 bước thực hành\n\n### Bước 1: Xác định vấn đề\nRõ ràng về điều bạn muốn giải quyết.\n\n### Bước 2: Đặt câu hỏi "Tại sao?"\nLặp lại 5 lần để tìm nguyên nhân gốc rễ.\n\n### Bước 3: Liệt kê giả định\nViết ra TẤT CẢ những gì bạn cho là đúng.\n\n### Bước 4: Kiểm chứng từng giả định\n"Điều này có đúng không? Làm sao tôi biết?"\n\n### Bước 5: Xây dựng lại từ nền tảng\nTạo giải pháp mới dựa trên những sự thật đã kiểm chứng.\n\n## Ví dụ kinh điển\n\n**Elon Musk & SpaceX:**\n- Giả định phổ biến: "Tên lửa quá đắt"\n- First Principles: Vật liệu tên lửa chi phí bao nhiêu? → Chỉ 2% giá bán\n- Giải pháp: Tự sản xuất và tái sử dụng tên lửa\n\n## Ứng dụng hàng ngày\n\n- **Học tập**: Thay vì "môn này khó", hỏi "tôi cần học điều gì cụ thể?"\n- **Kinh doanh**: Thay vì "ngành này cạnh tranh", hỏi "khách hàng thực sự cần gì?"\n- **Tài chính**: Thay vì "không đủ tiền tiết kiệm", hỏi "tiền tôi đi đâu mỗi tháng?"`,
                  keyTakeaways: JSON.stringify(['First Principles = tháo rời vấn đề thành sự thật cơ bản', 'Tránh tư duy theo analog — "ai cũng làm vậy" không phải lý do', '5 bước: Xác định → Tại sao → Giả định → Kiểm chứng → Xây dựng lại', 'Áp dụng cho học tập, kinh doanh, tài chính']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Bước nào sau đây KHÔNG thuộc phương pháp First Principles?', options: JSON.stringify(['Đặt câu hỏi "Tại sao?" 5 lần', 'Xem cách người khác giải quyết vấn đề tương tự', 'Kiểm chứng từng giả định', 'Xây dựng lại từ nền tảng']), correctAnswer: 'Xem cách người khác giải quyết vấn đề tương tự', explanation: 'Xem cách người khác làm là tư duy theo analog — điều mà First Principles cố gắng tránh.', order: 1 },
                    ],
                  },
                },
                {
                  title: 'Inversion Thinking (Tư duy ngược)',
                  content: `# Inversion Thinking (Tư duy ngược)\n\n## Khái niệm\n\n**Tư duy ngược** (Inversion) là phương pháp giải quyết vấn đề bằng cách **nghĩ về cách làm sao để THẤT BẠI**, sau đó **tránh những điều đó**.\n\n> "Thay vì nghĩ làm sao để thành công, hãy nghĩ làm sao để không thất bại." — Charlie Munger\n\n## Tại sao tư duy ngược hiệu quả?\n\n- **Dễ nhận diện rủi ro** hơn là cơ hội\n- **Tránh sai lầm** thường quan trọng hơn tìm giải pháp hoàn hảo\n- **Loại trừ** nhanh các hướng đi sai\n\n## Cách thực hành\n\n### Bước 1: Xác định mục tiêu\nVí dụ: "Muốn thuyết trình tốt"\n\n### Bước 2: Đảo ngược\n"Làm sao để thuyết trình tệ nhất?"\n- Không chuẩn bị\n- Nói quá nhanh\n- Không tương tác với khán giả\n- Technical quá nhiều\n\n### Bước 3: Tránh\nĐảm bảo KHÔNG làm những điều trên.\n\n## Ứng dụng\n\n### Trong học tập:\n- Thay vì "làm sao để nhớ lâu?"\n- Hỏi "làm sao để quên nhanh nhất?" → Không ôn lại, không ngủ đủ, không thực hành\n\n### Trong đầu tư:\n- Thay vì "làm sao để giàu?"\n- Hỏi "làm sao để mất tiền?" → Đầu tư không hiểu, theo đám đông, vay nợ đầu tư\n\n### Trong mối quan hệ:\n- Thay vì "làm sao để hạnh phúc?"\n- Hỏi "làm sao để phá hủy mối quan hệ?" → Không lắng nghe, chỉ trích, ích kỷ`,
                  keyTakeaways: JSON.stringify(['Tư duy ngược = nghĩ cách thất bại để tránh thất bại', 'Dễ nhận diện rủi ro hơn là cơ hội', '3 bước: Xác định mục tiêu → Đảo ngược → Tránh', 'Kết hợp với First Principles để phân tích toàn diện']),
                  order: 2, estimatedMinutes: 15,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Theo tư duy Inversion, thay vì hỏi "làm sao để thành công", bạn nên hỏi gì?', options: JSON.stringify(['Làm sao để làm việc chăm chỉ hơn?', 'Làm sao để không thất bại?', 'Làm sao để may mắn?', 'Làm sao để người khác giúp đỡ?']), correctAnswer: 'Làm sao để không thất bại?', explanation: 'Inversion tập trung vào việc tránh thất bại thay vì tìm kiếm thành công trực tiếp.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Ứng dụng thực tế', description: 'Áp dụng tư duy hệ thống trong cuộc sống và công việc', order: 6,
            lessons: {
              create: [
                {
                  title: 'Phân tích case study doanh nghiệp',
                  content: `# Phân tích case study với tư duy hệ thống\n\n## Case 1: Nokia và sự sụp đổ\n\n### Hệ thống Nokia (trước 2007):\n- **Thành phần**: Phần cứng xuất sắc, hệ thống phân phối mạnh, thương hiệu lớn\n- **Vòng lặp tăng cường**: Thị phần lớn → Lợi thế kinh tế → Giá rẻ → Thị phần lớn hơn\n- **Điểm mù**: Không nhận thấy vòng lặp mới từ smartphone\n\n### Apple tạo vòng lặp mới:\n- App Store → Nhiều developer → Nhiều ứng dụng → Nhiều người dùng → Nhiều developer\n- Vòng lặp tăng cường này **hủy** vòng lặp phần cứng của Nokia\n\n### Bài học:\n1. Vòng lặp cũ có thể bị phá vỡ bởi vòng lặp mới hoàn toàn\n2. Cần liên tục **quét môi trường** để nhận diện thay đổi\n3. **Mental model** quá cố định là nguy cơ lớn nhất\n\n## Case 2: Airbnb\n\n### Vòng lặp tăng cường 2 chiều:\n- **Người thuê**: Nhiều phòng → Giá tốt → Nhiều người thuê → Nhiều phòng hơn\n- **Chủ nhà**: Nhiều người thuê → Thu nhập cao → Nhiều chủ nhà tham gia → Nhiều phòng hơn\n\n### Vòng lặp cân bằng:\n- Giá tăng quá cao → Ít người thuê → Giá giảm → Người thuê quay lại\n\n## Cách áp dụng cho bạn\n\n1. **Vẽ CLD** cho vấn đề bạn đang đối mặt\n2. **Tìm vòng lặp** đang chi phối hành vi\n3. **Xác định delay** — khi nào kết quả sẽ xuất hiện\n4. **Tìm điểm can thiệp** — đâu là nơi thay đổi sẽ có tác động lớn nhất`,
                  keyTakeaways: JSON.stringify(['Vòng lặp cũ có thể bị phá vỡ bởi vòng lặp mới', 'Nokia thất bại vì không nhận thấy vòng lặp thay đổi', 'Airbnb thành công nhờ tạo vòng lặp tăng cường 2 chiều', 'Luôn quét môi trường để nhận diện thay đổi']),
                  order: 1, estimatedMinutes: 25,
                  quizzes: {
                    create: [
                      { type: 'scenario', question: 'Một startup có vòng lặp: User tăng → Data tăng → AI tốt hơn → User tăng thêm. Vòng lặp này thuộc loại gì và tạo lợi thế gì?', options: JSON.stringify(['Vòng lặp cân bằng — lợi thế ổn định', 'Vòng lặp tăng cường — lợi thế tích lũy (network effect)', 'Không phải vòng lặp phản hồi', 'Vòng lặp tiêu cực']), correctAnswer: 'Vòng lặp tăng cường — lợi thế tích lũy (network effect)', explanation: 'Đây là vòng lặp tăng cường tạo ra hiệu ứng mạng lưới — càng nhiều user thì sản phẩm càng tốt, khiến đối thủ khó cạnh tranh.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  // ==================== SKILL PATH 2: PHẢN BIỆN & THUYẾT PHỤC ====================
  const sp2 = await db.skillPath.create({
    data: {
      title: 'Phản biện & Thuyết phục', slug: 'phan-bien-thuyet-phuc', order: 2,
      description: 'Phát triển kỹ năng tư duy phản biện sắc bén và nghệ thuật thuyết phục để giao tiếp hiệu quả.',
      icon: '💡', color: 'amber',
      modules: {
        create: [
          {
            title: 'Nền tảng phản biện', description: 'Xây dựng nền tảng tư duy phản biện', order: 1,
            lessons: {
              create: [
                {
                  title: 'Tư duy phản biện là gì?',
                  content: `# Tư duy phản biện là gì?\n\n## Định nghĩa\n\n**Tư duy phản biện** (Critical Thinking) là quá trình tư duy chủ động, có mục đích, trong đó người suy nghĩ phân tích và đánh giá thông tin để đưa ra phán đoán.\n\n## 5 Kỹ năng phản biện cốt lõi\n\n### 1. Phân tích (Analysis)\nPhá vỡ thông tin phức tạp thành các phần nhỏ hơn để hiểu rõ hơn.\n\n### 2. Đánh giá (Evaluation)\nXác định giá trị, độ tin cậy của thông tin dựa trên bằng chứng.\n\n### 3. Suy luận (Inference)\nRút ra kết luận logic từ thông tin có sẵn.\n\n### 4. Giải thích (Explanation)\nTrình bày rõ ràng lý do và bằng chứng cho quan điểm.\n\n### 5. Tự nhận thức (Self-regulation)\nNhận biết và điều chỉnh những thiên kiến cá nhân.\n\n## Mô hình Paul-Elder\n\n### Các yếu tố của tư duy:\n1. **Mục đích**: Tại sao tôi đang nghĩ về điều này?\n2. **Câu hỏi**: Câu hỏi chính tôi đang trả lời?\n3. **Thông tin**: Dữ liệu, bằng chứng, kinh nghiệm nào tôi đang dùng?\n4. **Khái niệm**: Những ý tưởng chính tôi đang sử dụng?\n5. **Giả định**: Điều gì tôi cho là đúng?\n6. **Hệ quả**: Nếu tôi đúng/sai thì điều gì xảy ra?\n7. **Góc nhìn**: Có góc nhìn khác nào không?\n\n## Thực hành nhanh\n\nKhi đọc một bài báo, hãy tự hỏi:\n- Tác giả muốn tôi tin điều gì?\n- Bằng chứng nào hỗ trợ?\n- Có bằng chứng nào chống lại?\n- Có thiên kiến nào không?`,
                  keyTakeaways: JSON.stringify(['5 kỹ năng: Phân tích, Đánh giá, Suy luận, Giải thích, Tự nhận thức', 'Mô hình Paul-Elder có 7 yếu tố tư duy', 'Luôn tự hỏi: Mục đích, Bằng chứng, Thiên kiến, Góc nhìn khác']),
                  order: 1, estimatedMinutes: 15,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Kỹ năng nào KHÔNG phải kỹ năng phản biện cốt lõi?', options: JSON.stringify(['Phân tích', 'Suy luận', 'Bắt chước', 'Tự nhận thức']), correctAnswer: 'Bắt chước', explanation: '5 kỹ năng phản biện cốt lõi là: Phân tích, Đánh giá, Suy luận, Giải thích, và Tự nhận thức.', order: 1 },
                    ],
                  },
                },
                {
                  title: 'Phân tích luận điểm (Claim-Evidence-Reasoning)',
                  content: `# Phân tích luận điểm\n\n## Cấu trúc luận điểm (CER)\n\nMọi luận điểm hợp lệ đều có 3 phần:\n\n### 1. Claim (Luận điểm)\nĐiều mà người nói muốn bạn tin.\n\n### 2. Evidence (Bằng chứng)\nDữ liệu, sự kiện, số liệu hỗ trợ luận điểm.\n\n### 3. Reasoning (Lập luận)\nGiải thích tại sao bằng chứng ủng hộ luận điểm.\n\n## Cách phân tích\n\n### Bước 1: Tách các phần\n- **Claim**: "Nên ăn chay" → Đây là luận điểm\n- **Evidence**: "Nghiên cứu A cho thấy..." → Đây là bằng chứng\n- **Reasoning**: "Vì... nên..." → Đây là lập luận\n\n### Bước 2: Đánh giá bằng chứng\n- **Độ tin cậy**: Nguồn có uy tín không?\n- **Tính đầy đủ**: Đủ hỗ trợ claim không?\n- **Tính liên quan**: Thực sự liên quan đến claim không?\n\n### Bước 3: Kiểm tra lập luận\n- Logic có vững không?\n- Có sự nhảy cóc (logical leap) không?\n- Có fallacy nào không?\n\n## Ví dụ thực hành\n\n**Luận điểm**: "AI sẽ thay thế tất cả công việc"\n**Bằng chứng**: "AI đã thay thế nhiều việc trong sản xuất"\n**Lập luận**: "Vì AI ngày càng thông minh nên sẽ thay thế mọi việc"\n\n**Phân tích**: \n- Claim quá tuyệt đối ("tất cả")\n- Bằng chứng chỉ nói về "nhiều việc", không phải "tất cả"\n- Lập luận nhảy cóc từ "nhiều" sang "tất cả"`,
                  keyTakeaways: JSON.stringify(['Mọi luận điểm có 3 phần: Claim, Evidence, Reasoning', 'Đánh giá: Độ tin cậy, Tính đầy đủ, Tính liên quan', 'Cẩn thận với các từ tuyệt đối: "tất cả", "luôn", "không bao giờ"']),
                  order: 2, estimatedMinutes: 15,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Khi một người nói "AI sẽ thay thế tất cả công việc", lỗi phổ biến nhất trong lập luận này là gì?', options: JSON.stringify(['Không có bằng chứng', 'Từ "tất cả" quá tuyệt đối', 'Không có reasoning', 'Thiếu claim']), correctAnswer: 'Từ "tất cả" quá tuyệt đối', explanation: 'Từ "tất cả" là một generalization tuyệt đối — chưa có bằng chứng nào cho thấy AI thay thế MỌI công việc.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Logical Fallacies', description: 'Nhận diện các lỗi logic phổ biến', order: 2,
            lessons: {
              create: [
                {
                  title: 'Các lỗi logic phổ biến (Logical Fallacies)',
                  content: `# Logical Fallacies - Các lỗi logic phổ biến\n\n## Fallacy là gì?\n\n**Logical fallacy** là lỗi trong lập luận khiến kết luận không hợp lý dù có vẻ thuyết phục.\n\n## Nhóm 1: Lỗi liên quan đến con người\n\n### 1. Ad Hominem (Tấn công cá nhân)\n> "Quan điểm sai vì người nói không có bằng cấp."\n— **Vấn đề**: Tấn công người chứ không phải luận điểm.\n\n### 2. Appeal to Authority (Kêu gọi uy tín)\n> "Chuyên gia A nói vậy nên chắc đúng."\n— **Vấn đề**: Uy tín không đảm bảo đúng, cần xem bằng chứng.\n\n### 3. Bandwagon (Hiệu ứng đám đông)\n> "Tất cả mọi người đều làm vậy, nên đúng."\n— **Vấn đề**: Sự phổ biến không đồng nghĩa sự đúng đắn.\n\n## Nhóm 2: Lỗi logic\n\n### 4. Straw Man (Người rơm)\n> A: "Nên giảm thuế." B: "Vậy anh muốn trường học không có tiền?"\n— **Vấn đề**: Bóp méo quan điểm đối phương rồi tấn công phiên bản đã bóp méo.\n\n### 5. False Dilemma (Nhị phân sai)\n> "Hoặc ủng hộ tôi, hoặc chống lại tôi."\n— **Vấn đề**: Bỏ qua các lựa chọn khác.\n\n### 6. Slippery Slope (Dốc trượt)\n> "Nếu cho phép đi muộn, sẽ không ai đi học nữa."\n— **Vấn đề**: Cho rằng hành động nhỏ dẫn đến hậu quả thảm khốc mà không chứng minh.\n\n### 7. Circular Reasoning (Lập luận vòng)\n> "Kinh thánh đúng vì đó là lời Chúa. Lời Chúa đúng vì trong Kinh thánh."\n— **Vấn đề**: Kết luận được dùng làm tiền đề.\n\n### 8. Hasty Generalization (Tổng quát vội vàng)\n> "Gặp 2 người nước A thô lỗ → Người nước A đều thô lỗ."\n— **Vấn đề**: Rút kết luận từ mẫu quá nhỏ.\n\n## Nhóm 3: Lỗi liên quan đến cảm xúc\n\n### 9. Appeal to Emotion\n> "Hãy giúp đỡ em bé này — nếu bạn không giúp, em sẽ rất đau khổ."\n— **Vấn đề**: Dùng cảm xúc thay vì logic.\n\n### 10. Post Hoc\n> "Sau khi đeo vòng may mắn → Đỗ thi → Vòng giúp tôi đỗ."\n— **Vấn đề**: A xảy ra trước B không có nghĩa là A gây ra B.`,
                  keyTakeaways: JSON.stringify(['10+ fallacy phổ biến cần nhận biết', 'Ad Hominem: tấn công cá nhân thay vì luận điểm', 'Straw Man: bóp méo quan điểm đối phương', 'Cần kiểm tra mọi luận điểm xem có fallacy nào không']),
                  order: 1, estimatedMinutes: 25,
                  quizzes: {
                    create: [
                      { type: 'scenario', question: 'A nói: "Tôi nghĩ nên đầu tư thêm giáo dục." B trả lời: "Vậy ông muốn cắt quốc phòng để quân đội yếu đi?" Đây là fallacy nào?', options: JSON.stringify(['Ad Hominem', 'Straw Man', 'Bandwagon', 'Appeal to Authority']), correctAnswer: 'Straw Man', explanation: 'B đang bóp méo quan điểm của A — A không đề cập đến cắt quốc phòng. Đây là Straw Man.', order: 1 },
                      { type: 'mcq', question: '"Tôi đỗ đại học vì ngày thi tôi mặc áo đỏ, may mắn thật!" Đây là fallacy nào?', options: JSON.stringify(['Straw Man', 'Circular Reasoning', 'Post Hoc', 'False Dilemma']), correctAnswer: 'Post Hoc', explanation: 'Post Hoc = "sau đó nên vì đó" — A xảy ra trước B không có nghĩa là A gây ra B.', order: 2 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Phương pháp phản biện', description: 'Kỹ thuật đặt câu hỏi và phân tích sâu', order: 3,
            lessons: {
              create: [
                {
                  title: 'Socratic Questioning (Hỏi đáp Socrates)',
                  content: `# Socratic Questioning\n\n## Khái niệm\n\n**Socratic Questioning** là phương pháp đặt câu hỏi có hệ thống để:\n- Khám phá sự thật\n- Thách thức giả định\n- Tìm ra lỗ hổng trong lập luận\n- Kích thích tư duy sâu hơn\n\n## 6 loại câu hỏi Socrates\n\n### 1. Câu hỏi về sự rõ ràng\n- "Bạn có thể giải thích rõ hơn không?"\n- "Điều này có nghĩa là gì chính xác?"\n\n### 2. Câu hỏi về giả định\n- "Bạn giả định điều gì khi nói vậy?"\n- "Tại sao bạn tin điều đó là hiển nhiên?"\n\n### 3. Câu hỏi về bằng chứng\n- "Bằng chứng nào ủng hộ quan điểm này?"\n- "Làm sao bạn biết điều đó là đúng?"\n\n### 4. Câu hỏi về góc nhìn khác\n- "Có ai nghĩ khác không?"\n- "Nếu đứng ở góc nhìn đối lập thì sao?"\n\n### 5. Câu hỏi về hệ quả\n- "Nếu điều này đúng thì điều gì sẽ xảy ra?"\n- "Hệ quả dài hạn là gì?"\n\n### 6. Câu hỏi về bản chất câu hỏi\n- "Tại sao bạn đặt câu hỏi này?"\n- "Điều gì thực sự quan trọng ở đây?"\n\n## Quy tắc sử dụng\n\n1. **Hỏi với thái độ tôn trọng** — mục đích là tìm hiểu, không phải tấn công\n2. **Một câu hỏi mỗi lần** — không hỏi nhiều câu cùng lúc\n3. **Đợi câu trả lời** — kiên nhẫn lắng nghe\n4. **Theo dõi logic** — mỗi câu hỏi nên dựa trên câu trả lời trước`,
                  keyTakeaways: JSON.stringify(['6 loại câu hỏi: Rõ ràng, Giả định, Bằng chứng, Góc nhìn, Hệ quả, Bản chất', 'Mục đích là tìm hiểu, không phải tấn công', 'Một câu hỏi mỗi lần, đợi câu trả lời']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Khi ai đó nói "Rõ ràng AI nguy hiểm", câu hỏi Socrates nào phù hợp nhất?', options: JSON.stringify(['Bạn có chắc không?', '"Rõ ràng" nghĩa là gì? Bạn có thể giải thích?', 'Tôi không đồng ý', 'AI đã làm gì sai?']), correctAnswer: '"Rõ ràng" nghĩa là gì? Bạn có thể giải thích?', explanation: 'Câu hỏi về sự rõ ràng giúp người nói phải giải thích cụ thể hơn thay vì dùng từ mơ hồ.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Đánh giá thông tin', description: 'Nhận diện fake news và thiên kiến', order: 4,
            lessons: {
              create: [
                {
                  title: 'Fact-checking và Nhận diện Bias',
                  content: `# Fact-checking và Nhận diện Bias\n\n## Tại sao cần fact-check?\n\nTrong kỷ nguyên thông tin, mỗi ngày chúng ta tiếp xúc với **hàng nghìn thông tin**. Khả năng đánh giá thông tin là **kỹ năng sinh tồn**.\n\n## Framework CRAAP để đánh giá thông tin\n\n### C - Currency (Tính cập nhật)\n- Thông tin có còn mới không?\n- Link/biên tập có còn hoạt động không?\n\n### R - Relevance (Tính liên quan)\n- Liên quan đến câu hỏi của tôi không?\n- Đối tượng hướng đến là ai?\n\n### A - Authority (Thẩm quyền)\n- Ai là tác giả? Có uy tín không?\n- Nguồn xuất bản có đáng tin không?\n\n### A - Accuracy (Tính chính xác)\n- Thông tin có thể kiểm chứng không?\n- Có cited nguồn không?\n\n### P - Purpose (Mục đích)\n- Mục đích của bài viết là gì? (thông tin, bán hàng, thuyết phục?)\n- Có thiên kiến rõ ràng không?\n\n## Các loại thiên kiến phổ biến\n\n### 1. Confirmation Bias\nChỉ tìm kiếm thông tin **đúng với niềm tin** của mình.\n\n### 2. Availability Bias\nĐánh giá dựa trên thông tin **dễ nhớ nhất**, không phải thông tin quan trọng nhất.\n\n### 3. Anchoring Bias\nBị ảnh hưởng quá nhiều bởi **thông tin đầu tiên** nghe được.\n\n### 4. Dunning-Kruger Effect\nNgười có ít kiến thức **tự tin quá mức**, người giỏi lại **tự đánh giá thấp**.\n\n## 5 bước Fact-check nhanh\n\n1. **Đọc tiêu đề cẩn thận** — thường bị giật tít\n2. **Tìm tác giả** — ai viết?\n3. **Kiểm tra ngày** — thông tin còn mới không?\n4. **Tìm nguồn gốc** — link đến nghiên cứu/báo cáo gốc?\n5. **Cross-check** — các nguồn khác nói gì?`,
                  keyTakeaways: JSON.stringify(['Framework CRAAP: Currency, Relevance, Authority, Accuracy, Purpose', '4 thiên kiến phổ biến: Confirmation, Availability, Anchoring, Dunning-Kruger', '5 bước fact-check: Tiêu đề → Tác giả → Ngày → Nguồn gốc → Cross-check']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'scenario', question: 'Bạn chỉ đọc bài viết ủng hộ quan điểm của mình và cảm thấy rất thỏa mãn. Đây là thiên kiến gì?', options: JSON.stringify(['Anchoring Bias', 'Availability Bias', 'Confirmation Bias', 'Dunning-Kruger Effect']), correctAnswer: 'Confirmation Bias', explanation: 'Confirmation Bias = chỉ tìm kiếm và chấp nhận thông tin đúng với niềm tin sẵn có.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Nghệ thuật thuyết phục', description: 'Kỹ năng thuyết phục hiệu quả trong giao tiếp', order: 5,
            lessons: {
              create: [
                {
                  title: 'Ethos, Pathos, Logos - 3 trụ cột thuyết phục',
                  content: `# Ethos, Pathos, Logos\n\n## 3 trụ cột của Aristotle\n\n### 1. Ethos — Uy tín và Đạo đức\nThuyết phục bằng **sự đáng tin cậy** của người nói.\n\n**Cách xây dựng Ethos:**\n- Thể hiện chuyên môn và kinh nghiệm\n- Sử dụng ngôn ngữ phù hợp\n- Nhắc đến nguồn uy tín\n- Trung thực — thừa nhận điểm yếu\n\n> "Với 10 năm kinh nghiệm trong lĩnh vực này, tôi đã giúp hơn 500 công ty..."\n\n### 2. Pathos — Cảm xúc\nThuyết phục bằng cách **kết nối cảm xúc** với người nghe.\n\n**Cách sử dụng Pathos:**\n- Kể chuyện thực tế (storytelling)\n- Sử dụng hình ảnh sinh động\n- Thể hiện sự đồng cảm\n- Kêu gọi giá trị mà người nghe quan tâm\n\n> "Hãy tưởng tượng con bạn không được học đúng cách — cảm giác đó bạn có muốn không?"\n\n### 3. Logos — Logic\nThuyết phục bằng **lập luận logic** và **bằng chứng**.\n\n**Cách sử dụng Logos:**\n- Đưa ra số liệu, thống kê\n- Sử dụng ví dụ cụ thể\n- Giải thích causal relationships\n- So sánh options một cách logic\n\n> "Dữ liệu cho thấy chi phí giảm 30% trong 6 tháng, với ROI đạt 250%."\n\n## Cách kết hợp 3 trụ cột\n\n| Tình huống | Trụ cột chính | Phụ\n|-----------|---------------|-----|\n| Thuyết trình kinh doanh | Logos | Ethos |\n| Kêu gọi quyên góp | Pathos | Ethos |\n| Bào chữa tòa án | Ethos | Logos, Pathos |\n| Thuyết phục bạn bè | Pathos | Logos |\n\n## Quy tắc vàng\n- **Không lạm dụng một trụ cột** — cần cân bằng\n- **Hiểu đối tượng** — ai là người nghe?\n- **Mở đầu bằng Ethos**, **thân bài bằng Logos**, **kết luận bằng Pathos**`,
                  keyTakeaways: JSON.stringify(['Ethos = uy tín, Pathos = cảm xúc, Logos = logic', 'Mở đầu bằng Ethos, thân bài bằng Logos, kết luận bằng Pathos', 'Hiểu đối tượng để chọn trụ cột phù hợp']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Khi thuyết trình kinh doanh xin đầu tư, trụ cột nào nên là chính?', options: JSON.stringify(['Pathos', 'Ethos', 'Logos', 'Không có trụ cột chính']), correctAnswer: 'Logos', explanation: 'Trong kinh doanh, nhà đầu tư cần số liệu, ROI, và lập luận logic — đó là Logos.', order: 1 },
                    ],
                  },
                },
                {
                  title: '6 nguyên tắc thuyết phục của Cialdini',
                  content: `# 6 Nguyên tắc thuyết phục của Cialdini\n\n## 1. Reciprocity (Sự đáp trả)\nNgười ta cảm thấy **bắt buộc phải đáp trả** khi nhận được điều gì đó.\n\n**Áp dụng:**\n- Tặng nội dung miễn phí trước khi bán\n- Giúp đỡ người khác không mong回报\n- Tặng mẫu thử sản phẩm\n\n## 2. Commitment & Consistency (Cam kết và Nhất quán)\nNgười ta muốn **nhất quán** với những gì đã nói/làm.\n\n**Áp dụng:**\n- Nhận cam kết nhỏ trước ("bạn có đồng ý không?")\n- Viết cam kết xuống giấy\n- Đặt câu hỏi mở về giá trị\n\n## 3. Social Proof (Bằng chứng xã hội)\nNgười ta **sao chép hành động** của người khác.\n\n**Áp dụng:**\n- Hiển thị đánh giá, testimonial\n- "10,000 người đã sử dụng"\n- Đưa ra case study thành công\n\n## 4. Authority (Thẩm quyền)\nNgười ta **tin tưởng** người có chuyên môn.\n\n**Áp dụng:**\n- Hiển thị bằng cấp, chứng chỉ\n- Trích dẫn chuyên gia\n- Mặc trang phục phù hợp\n\n## 5. Liking (Sự thích)\nNgười ta dễ bị thuyết phục bởi **người mình thích**.\n\n**Áp dụng:**\n- Tìm điểm chung\n- Khen ngợi chân thành\n- Hợp tác thay vì đối đầu\n\n## 6. Scarcity (Sự khan hiếm)\nNgười ta **đánh giá cao hơn** những gì hiếm.\n\n**Áp dụng:**\n- "Chỉ còn 3 suất"\n- "Ưu đãi hết hạn trong 24h"\n- "Phiên bản giới hạn"`,
                  keyTakeaways: JSON.stringify(['6 nguyên tắc: Reciprocity, Commitment, Social Proof, Authority, Liking, Scarcity', 'Reciprocity: cho đi trước để nhận lại', 'Social Proof: người ta sao chép người khác', 'Scarcity: khan hiếm tạo giá trị']),
                  order: 2, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'scenario', question: 'Một website hiển thị "10,000 người đã mua" và "Đã bán 95%" trên trang sản phẩm. Đang áp dụng nguyên tắc nào?', options: JSON.stringify(['Reciprocity', 'Social Proof và Scarcity', 'Authority', 'Liking']), correctAnswer: 'Social Proof và Scarcity', explanation: '"10,000 người đã mua" là Social Proof, "Đã bán 95%" là Scarcity — kết hợp hai nguyên tắc.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Thực hành tranh biện', description: 'Kỹ năng debate và phản biện thực tế', order: 6,
            lessons: {
              create: [
                {
                  title: 'Kỹ năng tranh biện (Debate)',
                  content: `# Kỹ năng tranh biện\n\n## Tại sao cần học debate?\n\nDebate không phải là tranh cãi — nó là **nghệ thuật trình bày và bảo vệ quan điểm** một cách có cấu trúc.\n\n## Cấu trúc argument\n\n### 1. Assertion (Khẳng định)\nQuan điểm rõ ràng, cụ thể.\n- ❌ "AI không tốt"\n- ✅ "AI trong giáo dục cần được quản lý chặt hơn"\n\n### 2. Reasoning (Lập luận)\nGiải thích TẠI SAO quan điểm đúng.\n- "Vì AI có thể đưa ra thông tin sai (hallucination)..."\n\n### 3. Evidence (Bằng chứng)\nSự kiện, số liệu, nghiên cứu.\n- "...Theo nghiên cứu của Stanford 2024, 27% câu trả lời AI chứa sai sót."\n\n### 4. Significance (Tầm quan trọng)\nTại sao điều này quan trọng?\n- "Điều này ảnh hưởng đến hàng triệu học sinh..."\n\n## Kỹ năng phản biện đối phương\n\n### 1. Trích dẫn chính xác\n"Lư对手 nói rằng..." → Trích DỪNG lời đối phương.\n\n### 2. Tìm điểm yếu\nChỉ ra thiếu sót trong: Evidence, Logic, Assumptions.\n\n### 3. Đưa ra counter-example\n"Nhưng trong trường hợp X, điều ngược lại lại xảy ra..."\n\n### 4. Giải quyết counter-argument\n"Dù đối phương có đúng về Y, nhưng Z vẫn đúng vì..."\n\n## Quy tắc ứng xử\n\n- **Tấn công luận điểm, không tấn công người**\n- **Lắng nghe trước khi phản bác** — hiểu đúng ý đối phương\n- **Thừa nhận điểm mạnh** của đối phương khi có\n- **Giữ bình tĩnh** — cảm xúc mạnh làm giảm sức thuyết phục`,
                  keyTakeaways: JSON.stringify(['Cấu trúc argument: Assertion → Reasoning → Evidence → Significance', 'Tấn công luận điểm, KHÔNG tấn công người', 'Lắng nghe trước khi phản bác', 'Thừa nhận điểm mạnh của đối phương']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Câu nào sau đây là assertion (khẳng định) tốt?', options: JSON.stringify(['AI nguy hiểm', 'AI cần được quản lý cẩn thận trong y tế', 'Tôi không thích AI', 'AI là tương lai']), correctAnswer: 'AI cần được quản lý cẩn thận trong y tế', explanation: 'Assertion tốt cần cụ thể, rõ ràng, và có thể tranh luận. Các câu khác hoặc quá mơ hồ hoặc quá cảm xúc.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  // ==================== SKILL PATH 3: QUẢN TRỊ AI ====================
  const sp3 = await db.skillPath.create({
    data: {
      title: 'Quản trị AI', slug: 'quan-tri-ai', order: 3,
      description: 'Hiểu cách AI hoạt động, ứng dụng và quản lý AI hiệu quả trong công việc và cuộc sống.',
      icon: '🤖', color: 'violet',
      modules: {
        create: [
          {
            title: 'Hiểu về AI', description: 'Nền tảng kiến thức về Trí tuệ Nhân tạo', order: 1,
            lessons: {
              create: [
                {
                  title: 'AI là gì và các loại AI',
                  content: `# AI là gì và các loại AI\n\n## Định nghĩa\n\n**Trí tuệ Nhân tạo** (AI) là lĩnh vực khoa học máy tính nhằm tạo ra hệ thống thực hiện các nhiệm vụ cần trí thông minh của con người.\n\n## Phân loại AI\n\n### ANI - Artificial Narrow Intelligence\n- AI chuyên biệt cho **một nhiệm vụ cụ thể**\n- Ví dụ: ChatGPT, nhận diện khuôn mặt, xe tự lái\n- Đây là loại AI **duy nhất tồn tại hiện tại**\n\n### AGI - Artificial General Intelligence\n- AI có khả năng **tư duy tổng quát** như con người\n- **Chưa được tạo ra** — vẫn trong nghiên cứu\n\n### ASI - Artificial Superintelligence\n- AI **thông minh hơn con người** ở mọi lĩnh vực\n- Vẫn là **khái niệm lý thuyết**\n\n## AI hoạt động như thế nào?\n\n### Machine Learning\n- Học từ dữ liệu thay vì được lập trình trực tiếp\n- Ví dụ: Học nhận diện mèo từ hàng nghìn ảnh mèo\n\n### Deep Learning\n- Sử dụng neural network nhiều lớp\n- Hiệu quả cho xử lý ngôn ngữ, hình ảnh, âm thanh\n\n### NLP (Xử lý ngôn ngữ tự nhiên)\n- Cho phép AI hiểu và tạo văn bản\n- Là nền tảng của ChatGPT, Gemini, Claude\n\n## AI trong cuộc sống hàng ngày\n\n| Lĩnh vực | Ứng dụng |\n|----------|--------|\n| Y tế | Chẩn đoán, phát hiện thuốc |\n| Giáo dục | Cá nhân hóa, chấm bài |\n| Tài chính | Phát hiện gian lận |\n| Giao thông | Xe tự lái |\n| Giải trí | Gợi ý nội dung |\n\n## Hạn chế quan trọng\n\n- **Hallucination** — AI có thể tạo thông tin sai\n- **Không có ý thức** — chỉ xử lý dữ liệu\n- **Thiên kiến dữ liệu** — học sai từ data sai\n- **Cần giám sát** — không thể hoàn toàn tự động`,
                  keyTakeaways: JSON.stringify(['3 loại AI: ANI (hiện tại), AGI (tương lai), ASI (lý thuyết)', 'AI hoạt động qua Machine Learning và Deep Learning', 'Hạn chế: Hallucination, thiên kiến, cần giám sát', 'Hiện tại chỉ có ANI tồn tại']),
                  order: 1, estimatedMinutes: 15,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Loại AI nào hiện tại đã tồn tại?', options: JSON.stringify(['AGI', 'ASI', 'ANI', 'Cả 3 loại']), correctAnswer: 'ANI', explanation: 'ANI (Artificial Narrow Intelligence) là loại AI duy nhất đã tồn tại hiện tại.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Prompt Engineering', description: 'Nghệ thuật giao tiếp hiệu quả với AI', order: 2,
            lessons: {
              create: [
                {
                  title: 'Kỹ thuật Prompt Engineering',
                  content: `# Prompt Engineering\n\n## Prompt là gì?\n\n**Prompt** là câu lệnh bạn gửi cho AI. **Prompt Engineering** là kỹ năng thiết kế prompt hiệu quả để nhận kết quả tốt nhất.\n\n## 6 kỹ thuật cơ bản\n\n### 1. Cụ thể và rõ ràng\n\`\`\`\n❌ Viết bài về môi trường\n✅ Viết bài 500 chữ về tác động rác thải nhựa đến đại dương, \\\n   cho độc giả 15-18 tuổi, nhấn mạnh giải pháp thực tế\n\`\`\`\n\n### 2. Role Prompting\n\`\`\`\nBạn là chuyên gia marketing 10 năm kinh nghiệm. \\\nPhân tích chiến lược marketing của...\n\`\`\`\n\n### 3. Few-shot Learning\n\`\`\`\nVí dụ:\n- Input: "Tôi buồn" → Output: "Bạn muốn kể thêm không?"\n- Input: "Tôi vui" → Output: "Tuyệt vời! Điều gì khiến bạn vui?"\n- Input: "Tôi lo" → Output: ???\n\`\`\`\n\n### 4. Chain of Thought\n\`\`\`\nHãy giải bài toán này, phân tích từng bước:\n1. Đọc kỹ đề bài\n2. Xác định thông tin đã biết\n3. Lên kế hoạch giải\n4. Thực hiện và kiểm tra\n\`\`\`\n\n### 5. Đặt ràng buộc\n\`\`\`\nViết 200 chữ, không dùng "tuy nhiên", \\\ngiọng văn thân thiện, có 3 ví dụ cụ thể\n\`\`\`\n\n### 6. Yêu cầu AI tự review\n\`\`\`\nSau khi trả lời, hãy tự review, chỉ ra điểm sai \\\nvà đưa ra phiên bản cải thiện.\n\`\`\`\n\n## Công thức Prompt hiệu quả\n\n**[Vai trò] + [Nhiệm vụ cụ thể] + [Ràng buộc] + [Định dạng output]**\n\nVí dụ: "Bạn là giáo viên [vai trò]. Giải thích quantum computing cho người mới bắt đầu [nhiệm vụ], trong 300 chữ, dùng analog đời thường [ràng buộc], với bullet points [định dạng]."`,
                  keyTakeaways: JSON.stringify(['Prompt cần: cụ thể, rõ ràng, có vai trò và ràng buộc', '6 kỹ thuật: Role, Few-shot, CoT, Ràng buộc, Tự review', 'Công thức: Vai trò + Nhiệm vụ + Ràng buộc + Định dạng']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Kỹ thuật yêu cầu AI phân tích từng bước để có kết quả tốt hơn là gì?', options: JSON.stringify(['Role Prompting', 'Few-shot Learning', 'Chain of Thought', 'Zero-shot Learning']), correctAnswer: 'Chain of Thought', explanation: 'Chain of Thought yêu cầu AI phân tích từng bước, giúp đưa ra kết quả chính xác hơn.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'AI Tools & Workflow', description: 'Sử dụng AI tools và xây dựng workflow hiệu quả', order: 3,
            lessons: {
              create: [
                {
                  title: 'Xây dựng AI Workflow',
                  content: `# Xây dựng AI Workflow\n\n## Workflow là gì?\n\n**AI Workflow** là quy trình kết hợp AI vào công việc để tăng hiệu suất mà không phụ thuộc hoàn toàn.\n\n## Nguyên tắc "Human-in-the-loop"\n\nAI hỗ trợ, **con người quyết định**. Không bao giờ để AI tự động hoàn toàn mà không kiểm tra.\n\n## Xây dựng workflow cho từng lĩnh vực\n\n### 1. Viết lách / Content\n- AI: Brainstorm ideas, phác thảo nháp, sửa lỗi ngữ pháp\n- Human: Kiểm tra fact, thêm góc nhìn cá nhân, quyết định tone\n\n### 2. Lập trình\n- AI: Viết boilerplate code, debug, explain error\n- Human: Thiết kế kiến trúc, review code, quyết định approach\n\n### 3. Nghiên cứu / Phân tích\n- AI: Tổng hợp thông tin, tóm tắt tài liệu, tìm pattern\n- Human: Đặt câu hỏi đúng, đánh giá kết quả, đưa ra insight\n\n### 4. Ra quyết định\n- AI: Cung cấp data, phân tích pros/cons, simulation\n- Human: Xem xét context, đánh giá rủi ro, ra quyết định cuối\n\n## 5 bước triển khai AI\n\n1. **Xác định pain point** — việc nào tốn thời gian nhất?\n2. **Tìm tool phù hợp** — AI nào giải quyết được?\n3. **Pilot thử nghiệm** — dùng 1-2 tuần, đánh giá\n4. **Tối ưu prompt** — điều chỉnh để có kết quả tốt nhất\n5. **Scale lên** — mở rộng khi đã ổn định\n\n## Lưu ý quan trọng\n\n- Luôn **kiểm tra output** của AI\n- **Bảo mật thông tin** — không đưa data nhạy cảm vào AI công khai\n- **Cập nhật thường xuyên** — AI phát triển rất nhanh\n- **Đo lường kết quả** — so sánh trước và sau khi dùng AI`,
                  keyTakeaways: JSON.stringify(['AI Workflow = quy trình kết hợp AI vào công việc', 'Nguyên tắc Human-in-the-loop: AI hỗ trợ, con người quyết định', '5 bước: Pain point → Tool → Pilot → Tối ưu → Scale', 'Luôn kiểm tra output, bảo mật data']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Nguyên tắc quan trọng nhất khi sử dụng AI trong công việc là gì?', options: JSON.stringify(['Dùng AI càng nhiều càng tốt', 'Human-in-the-loop: con người kiểm tra và quyết định', 'Chỉ dùng AI cho việc khó', 'AI luôn đúng nên cần làm theo']), correctAnswer: 'Human-in-the-loop: con người kiểm tra và quyết định', explanation: 'Human-in-the-loop đảm bảo chất lượng — AI hỗ trợ nhưng con người luôn kiểm tra và ra quyết định cuối.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Đánh giá AI', description: 'Framework đánh giá và lựa chọn công cụ AI', order: 4,
            lessons: {
              create: [
                {
                  title: 'Framework đánh giá công cụ AI',
                  content: `# Framework đánh giá công cụ AI\n\n## Tại sao cần đánh giá?\n\nVới hàng nghìn AI tools ra đời mỗi tháng, việc **chọn đúng công cụ** quan trọng hơn việc dùng nhiều công cụ.\n\n## Framework AIDE\n\n### A - Accuracy (Độ chính xác)\n- Output có chính xác không?\n- Tỷ lệ hallucination?\n- Có kiểm tra được không?\n\n### I - Integration (Khả năng tích hợp)\n- Tích hợp với workflow hiện tại?\n- API sẵn sàng?\n- Tương thích với tools khác?\n\n### D - Data Privacy (Bảo mật dữ liệu)\n- Data có được giữ lại không?\n- Có encrypt không?\n- Comply với GDPR không?\n\n### E - Ease of Use (Dễ sử dụng)\n- Learning curve?\n- UI/UX tốt không?\n- Documentation đầy đủ?\n\n## So sánh AI chatbot phổ biến\n\n| Tiêu chí | ChatGPT | Claude | Gemini |\n|----------|---------|--------|--------|\n| Độ chính xác | Tốt | Rất tốt (ngắn) | Tốt |\n| Độ dài output | Rất dài | Tốt | Tốt |\n| Coding | Rất tốt | Tốt | Tốt |\n| Nguồn web | Có (Plus) | Có | Rất tốt |\n| Giá | Free/$20 | Free/$20 | Free/$20 |\n\n## Quy trình lựa chọn\n\n1. **Xác định nhu cầu** — bạn cần AI làm gì?\n2. **Liệt kê options** — ít nhất 3 tools\n3. **Đánh giá theo AIDE** — chấm điểm 1-5\n4. **Pilot thử** — dùng thử 1-2 tuần\n5. **Quyết định** — dựa trên data, không cảm tính`,
                  keyTakeaways: JSON.stringify(['Framework AIDE: Accuracy, Integration, Data Privacy, Ease of Use', 'Chọn đúng công cụ quan trọng hơn dùng nhiều', 'Luôn pilot thử trước khi quyết định', 'Đánh giá dựa trên data, không cảm tính']),
                  order: 1, estimatedMinutes: 15,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Trong framework AIDE, chữ D đại diện cho gì?', options: JSON.stringify(['Decision', 'Data Privacy', 'Development', 'Design']), correctAnswer: 'Data Privacy', explanation: 'AIDE = Accuracy, Integration, Data Privacy, Ease of Use.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'AI Ethics & Chiến lược', description: 'Đạo đức AI và chiến lược cá nhân', order: 5,
            lessons: {
              create: [
                {
                  title: 'Đạo đức và rủi ro AI',
                  content: `# Đạo đức và Rủi ro AI\n\n## 5 vấn đề đạo đức AI\n\n### 1. Thiên kiến (Bias)\nAI học từ data con người — bao gồm cả **định kiến**.\n- AI tuyển dụng phân biệt giới tính\n- AI nhận diện khuôn mặt kém với người da màu\n\n### 2. Bảo mật (Privacy)\n- Data cá nhân được dùng để train AI\n- Deepfake — tạo video giả mạo\n- Tracking hành vi người dùng\n\n### 3. Minh bạch (Transparency)\n- AI "black box" — không giải thích được tại sao đưa ra quyết định\n- Khó kiểm tra nếu AI sai\n\n### 4. Trách nhiệm (Accountability)\n- Nếu AI gây hại, ai chịu trách nhiệm?\n- Developer? User? Company?\n\n### 5. Tác động xã hội\n- Thay đổi thị trường lao động\n- Deepfakes ảnh hưởng bầu cử\n- Thông tin sai lan truyền nhanh hơn\n\n## 5 nguyên tắc sử dụng AI có trách nhiệm\n\n1. **Luôn kiểm tra** output của AI trước khi sử dụng\n2. **Không dùng AI** để lừa đảo, thao túng\n3. **Tôn trọng bản quyền** — AI không phải là phép thuật copy\n4. **Bảo vệ data** cá nhân và khách hàng\n5. **Học liên tục** — hiểu rõ cả lợi ích và rủi ro\n\n## Chiến lược cá nhân cho tương lai AI\n\n### Kỹ năng AI không thay thế:\n- **Sự sáng tạo** — AI tái tạo, con người tạo mới\n- **Đánh giá** — AI đưa ra, con người đánh giá\n- **Giao tiếp con người** — empathy, leadership\n- **Tư duy hệ thống** — hiểu bức tranh lớn\n\n### Hành động ngay:\n1. Học sử dụng AI tools hiệu quả\n2. Phát triển kỹ năng "soft skills"\n3. Giữ tư duy phản biện khi dùng AI\n4. Theo dõi xu hướng AI thường xuyên`,
                  keyTakeaways: JSON.stringify(['5 vấn đề: Thiên kiến, Bảo mật, Minh bạch, Trách nhiệm, Tác động xã hội', '5 nguyên tắc: Kiểm tra, Không lừa đảo, Bản quyền, Bảo vệ data, Học liên tục', 'AI không thay thế: Sáng tạo, Đánh giá, Giao tiếp, Tư duy hệ thống']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'scenario', question: 'Một công ty dùng AI để screening CV và phát hiện AI từ chối nhiều ứng viên nữ. Đây là vấn đề gì?', options: JSON.stringify(['Bảo mật', 'Thiên kiến (Bias)', 'Minh bạch', 'Trách nhiệm']), correctAnswer: 'Thiên kiến (Bias)', explanation: 'AI học thiên kiến từ data lịch sử — nếu data training có khuynh hướng phân biệt, AI sẽ tái tạo phân biệt đó.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  // ==================== SKILL PATH 4: TƯ DUY CHIẾN LƯỢC ====================
  const sp4 = await db.skillPath.create({
    data: {
      title: 'Tư duy chiến lược', slug: 'tu-duy-chien-luoc', order: 4,
      description: 'Học cách tư duy dài hạn, phân tích tình huống và đưa ra quyết định chiến lược.',
      icon: '♟️', color: 'rose',
      modules: {
        create: [
          {
            title: 'Nền tảng chiến lược', description: 'Tư duy chiến lược và SWOT Analysis', order: 1,
            lessons: {
              create: [
                {
                  title: 'Tư duy chiến lược là gì?',
                  content: `# Tư duy chiến lược là gì?\n\n## Định nghĩa\n\n**Tư duy chiến lược** là khả năng nhìn bức tranh lớn, xác định cơ hội và rủi ro, đưa ra quyết định dài hạn.\n\n## Chiến lược vs Chiến thuật\n\n| | Chiến lược | Chiến thuật |\n|--|-----------|------------|\n| Tầm nhìn | 3-10 năm | Ngày-tháng |\n| Câu hỏi | "Phải làm gì?" | "Làm thế nào?" |\n| Phạm vi | Toàn bộ | Cụ thể |\n| Linh hoạt | Điều chỉnh | Thực hiện |\n\n## 4 yếu tố cốt lõi\n\n### 1. Tầm nhìn (Vision)\nKhả năng nhìn thấy tương lai mong muốn.\n\n### 2. Phân tích tình huống\nHiểu môi trường bên trong và bên ngoài.\n\n### 3. Ra quyết định\nChọn hướng đi tối ưu.\n\n### 4. Thực thi\nBiến chiến lược thành hành động.\n\n## SWOT Analysis\n\n### Strengths (Điểm mạnh)\nBạn giỏi gì? Lợi thế cạnh tranh?\n\n### Weaknesses (Điểm yếu)\nBạn cần cải thiện gì?\n\n### Opportunities (Cơ hội)\nXu hướng nào đang có lợi cho bạn?\n\n### Threats (Thách thức)\nRủi ro nào cần đối mặt?\n\n## Ứng dụng SWOT cá nhân\n\n- **Strengths**: Kỹ năng lập trình, tiếng Anh tốt\n- **Weaknesses**: Giao tiếp yếu, quản lý thời gian kém\n- **Opportunities**: Ngành AI đang phát triển, remote work\n- **Threats**: AI thay thế coding, cạnh tranh cao\n\n→ **Chiến lược**: Phát triển kỹ năng AI + cải thiện giao tiếp`,
                  keyTakeaways: JSON.stringify(['Chiến lược = "Phải làm gì?", Chiến thuật = "Làm thế nào?"', '4 yếu tố: Tầm nhìn, Phân tích, Quyết định, Thực thi', 'SWOT: Strengths, Weaknesses, Opportunities, Threats']),
                  order: 1, estimatedMinutes: 15,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'SWOT Analysis có 4 yếu tố, chữ O đại diện cho gì?', options: JSON.stringify(['Organization', 'Opportunities', 'Optimization', 'Objectives']), correctAnswer: 'Opportunities', explanation: 'SWOT = Strengths, Weaknesses, Opportunities, Threats.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Game Theory cơ bản', description: 'Lý thuyết trò chơi và ứng dụng', order: 2,
            lessons: {
              create: [
                {
                  title: 'Game Theory và Nash Equilibrium',
                  content: `# Game Theory cơ bản\n\n## Game Theory là gì?\n\n**Lý thuyết trò chơi** nghiên cứu cách các "người chơi" đưa ra quyết định khi kết quả của họ phụ thuộc vào lựa chọn của người khác.\n\n## Nash Equilibrium\n\nTrạng thái mà không ai có động lực **thay đổi chiến lược** nếu người khác không đổi.\n\n### Ví dụ: Chọn nhà hàng\n- Bạn và bạn bè muốn gặp nhau\n- Thích ăn cùng nhau hơn ăn riêng\n- **Nash Equilibrium**: Cùng đến một nhà hàng\n\n## Trò chơi cổ điển\n\n### 1. Prisoner's Dilemma (Thế tiến thoái lưỡng nan)\n\n| | B cooperate | B betray |\n|--|-------------|----------|\n| A cooperate | Cả 2: 1 năm | A: 3 năm, B: tự do |\n| A betray | A: tự do, B: 3 năm | Cả 2: 2 năm |\n\n**Nash Equilibrium**: Cả hai betray (dù hợp tác tốt hơn cho cả hai).\n\n**Bài học**: Lợi ích cá nhân có thể dẫn đến kết quả tồi cho tất cả.\n\n### 2. Zero-sum vs Non-zero-sum\n\n- **Zero-sum**: Tôi thắng = bạn thua (cờ vua, poker)\n- **Non-zero-sum**: Cả hai có thể cùng thắng (kinh doanh, thương lượng)\n\n## Ứng dụng hàng ngày\n\n- **Đàm phán**: Hiểu BEST alternative của đối phương\n- **Kinh doanh**: Định giá chiến lược khi biết đối thủ sẽ phản ứng\n- **Quan hệ**: Nhận diện win-win vs win-lose situations`,
                  keyTakeaways: JSON.stringify(['Game Theory nghiên cứu quyết định khi kết quả phụ thuộc người khác', 'Nash Equilibrium = không ai muốn đổi chiến lược', 'Prisoner Dilemma: lợi ích cá nhân → kết quả tồi chung', 'Zero-sum vs Non-zero-sum: phân biệt tình huống']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'scenario', question: 'Trong Prisoner Dilemma, nếu cả hai đều cooperate thì mỗi người nhận 1 năm tù. Nếu một người betray, người betray được tự do. Tại sao Nash Equilibrium lại là cả hai betray?', options: JSON.stringify(['Vì betray luôn tốt hơn bất kể đối phương chọn gì', 'Vì họ ghét nhau', 'Vì 2 năm tù tốt hơn 1 năm', 'Không phải Nash Equilibrium']), correctAnswer: 'Vì betray luôn tốt hơn bất kể đối phương chọn gì', explanation: 'Nếu đối phương cooperate → betray tốt hơn (0 vs 1 năm). Nếu đối phương betray → betray vẫn tốt hơn (2 vs 3 năm). Vì vậy betray luôn là dominant strategy.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Đàm phán & Ra quyết định', description: 'Kỹ năng đàm phán và ra quyết định trong bất chắc', order: 3,
            lessons: {
              create: [
                {
                  title: 'BATNA, ZOPA và Kỹ năng đàm phán',
                  content: `# Kỹ năng Đàm phán\n\n## BATNA (Best Alternative To a Negotiated Agreement)\n\n**BATNA** là phương án tốt nhất của bạn NẾU đàm phán thất bại.\n\n### Tại sao BATNA quan trọng?\n- BATNA càng tốt → bạn càng **có quyền lực** trong đàm phán\n- Không bao giờ chấp nhận deal tệ hơn BATNA\n- **Luôn xác định BATNA trước khi đàm phán**\n\n### Ví dụ:\n- Bạn đàm phán lương: BATNA = offer từ công ty khác\n- Mua nhà: BATNA = mua nhà khác\n\n## ZOPA (Zone Of Possible Agreement)\n\nKhoảng giá mà **cả hai bên đều chấp nhận**.\n\n- Người bán muốn: >= $100k\n- Người mua muốn: <= $120k\n- **ZOPA**: $100k - $120k\n- Nếu người bán muốn $130k → **Không có ZOPA** → Không thể deal\n\n## Decision Trees (Cây quyết định)\n\n### Cách tạo:\n1. Viết **quyết định** cần ra ở gốc\n2. Mỗi **nhánh** = một lựa chọn\n3. Mỗi **lá** = kết quả + xác suất + giá trị\n\n### Expected Value:\n\`\`\`\nLựa chọn A: 60% × 100tr + 40% × 0 = 60tr\nLựa chọn B: 100% × 40tr = 40tr\n→ Chọn A vì Expected Value cao hơn\n\`\`\`\n\n## Quy tắc ra quyết định\n\n1. **Xác định options** — có những lựa chọn nào?\n2. **Đánh giá rủi ro** — worst case scenario?\n3. **Tính expected value** — khi có xác suất\n4. **Kiểm tra reversibility** — có thể quay lại không?\n5. **Cảm xúc tách riêng** — quyết định logic, cảm xúc riêng`,
                  keyTakeaways: JSON.stringify(['BATNA = phương án tốt nhất nếu đàm phán thất bại', 'ZOPA = khoảng giá cả hai bên đều chấp nhận', 'Expected Value = Σ(xác suất × giá trị)', 'Quyết định logic tách riêng cảm xúc']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'scenario', question: 'Bạn đàm phán lương, công ty A offer 20tr/tháng, công ty B offer 22tr. BATNA của bạn với công ty A là gì?', options: JSON.stringify(['20tr', '22tr (offer từ B)', '25tr', 'Không có BATNA']), correctAnswer: '22tr (offer từ B)', explanation: 'BATNA = Best Alternative To a Negotiated Agreement = phương án tốt nhất nếu đàm phán thất bại = offer từ công ty B.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Ứng dụng cuộc sống', description: 'Áp dụng tư duy chiến lược vào đời sống', order: 4,
            lessons: {
              create: [
                {
                  title: 'Ứng dụng tư duy chiến lược trong cuộc sống',
                  content: `# Ứng dụng tư duy chiến lược\n\n## 1. Nghề nghiệp\n\n### Phân tích ngành nghề:\n- **Xu hướng**: Ngành nào đang tăng trưởng? (AI, green energy, healthcare)\n- **Kỹ năng**: Kỹ năng nào sẽ cần trong 5-10 năm?\n- **Định vị**: Điểm khác biệt của bạn là gì?\n\n### Chiến lược phát triển:\n- **T-market**: Học kỹ năng ít người có nhưng nhiều người cần\n- **T-shaped**: Sâu một chuyên môn + rộng nhiều lĩnh vực\n- **Continuous learning**: Học 1 tiếng mỗi ngày = 365 tiếng/năm\n\n## 2. Tài chính cá nhân\n\n### Sử dụng Expected Value cho đầu tư:\n- Không phải đánh bạc — đánh giá **risk-reward ratio**\n- Diversification = "không bỏ tất cả trứng vào một giỏ"\n- Compound interest = vòng lặp tăng cường của tài chính\n\n### Chiến lược tiết kiệm:\n1. 50/30/20 Rule: Needs/Wants/Savings\n2. Emergency fund: 3-6 tháng chi phí\n3. Invest early: Time in market > Timing the market\n\n## 3. Quan hệ và Giao tiếp\n\n### Game Theory trong quan hệ:\n- **Iterated Prisoner Dilemma**: Hợp tác ban đầu, sau đó "tit-for-tat"\n- **Reputation**: Uy tín dài hạn quan trọng hơn lợi ích ngắn hạn\n\n### Đàm phán trong quan hệ:\n- Tìm **win-win** thay vì win-lose\n- Hiểu **BATNA** của cả hai bên\n- **Separate people from problem** — tấn công vấn đề, không người\n\n## Kế hoạch hành động\n\n1. Viết SWOT cá nhân của bạn\n2. Xác định 3 mục tiêu dài hạn (1-5 năm)\n3. Chia nhỏ thành milestones hàng tháng\n4. Review và điều chỉnh mỗi quý`,
                  keyTakeaways: JSON.stringify(['Áp dụng chiến lược vào nghề nghiệp, tài chính, quan hệ', 'T-market: học kỹ năng ít người có, nhiều người cần', 'Win-win luôn tốt hơn win-lose trong dài hạn', 'Review và điều chỉnh chiến lược thường xuyên']),
                  order: 1, estimatedMinutes: 20,
                  quizzes: {
                    create: [
                      { type: 'mcq', question: 'Nguyên tắc 50/30/20 trong tài chính cá nhân có nghĩa là gì?', options: JSON.stringify(['50% đầu tư, 30% tiết kiệm, 20% chi tiêu', '50% nhu cầu, 30% muốn, 20% tiết kiệm', '50% tiết kiệm, 30% nhu cầu, 20% đầu tư', '50% chi tiêu, 30% tiết kiệm, 20% đầu tư']), correctAnswer: '50% nhu cầu, 30% muốn, 20% tiết kiệm', explanation: '50/30/20 Rule: 50% cho nhu cầu thiết yếu, 30% cho mong muốn, 20% cho tiết kiệm/đầu tư.', order: 1 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  // ==================== DAILY CHALLENGE ====================
  const today = new Date().toISOString().split('T')[0]
  await db.dailyChallenge.create({
    data: {
      date: today, title: 'Phân tích vòng lặp trong cuộc sống',
      description: 'Tìm và phân tích ít nhất 2 vòng lặp phản hồi trong công việc hoặc học tập. Xác định loại vòng lặp và cách cải thiện.',
      challengeType: 'reflection', content: JSON.stringify({ instructions: 'Mô tả vòng lặp, xác định loại và gợi ý cải thiện.', minWords: 100 }), xpReward: 50,
    },
  })

  console.log('✅ Seed completed successfully!')
  console.log(`  - Created 4 skill paths`)
  console.log(`  - SP1 (Tư duy hệ thống): ${await db.module.count({ where: { skillPathId: sp1.id } })} modules`)
  console.log(`  - SP2 (Phản biện): ${await db.module.count({ where: { skillPathId: sp2.id } })} modules`)
  console.log(`  - SP3 (Quản trị AI): ${await db.module.count({ where: { skillPathId: sp3.id } })} modules`)
  console.log(`  - SP4 (Chiến lược): ${await db.module.count({ where: { skillPathId: sp4.id } })} modules`)
  console.log(`  - Total lessons: ${await db.lesson.count()}`)
  console.log(`  - Total quizzes: ${await db.quiz.count()}`)
  console.log(`  - Created 10 badges`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
