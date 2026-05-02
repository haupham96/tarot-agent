// Tarot card data with meanings in Vietnamese & English
// Each card has a mystical SVG artwork definition

const TAROT_CARDS = [
  {
    id: 'fool',
    name: { vi: 'The Fool', en: 'The Fool' },
    hue: 210, // midnight blue-violet
    symbol: 'fool',
    meaning: {
      upright: {
        vi: 'Khởi đầu mới, hành trình bất ngờ, niềm tin vào vũ trụ. Hãy đón nhận cơ hội mới với trái tim rộng mở.',
        en: 'New beginnings, unexpected journey, faith in the universe. Embrace new opportunities with an open heart.',
      },
      reversed: {
        vi: 'Liều lĩnh, thiếu suy nghĩ, sợ thay đổi. Dừng lại và cân nhắc trước khi bước tiếp.',
        en: 'Recklessness, thoughtlessness, fear of change. Pause and reflect before moving forward.',
      },
    },
  },
  {
    id: 'magician',
    name: { vi: 'The Magician', en: 'The Magician' },
    hue: 45, // gold
    symbol: 'magician',
    meaning: {
      upright: {
        vi: 'Sức mạnh ý chí, sự biểu hiện, tài năng tiềm ẩn. Bạn có mọi công cụ cần thiết để tạo nên điều mình muốn.',
        en: 'Willpower, manifestation, hidden talent. You hold every tool needed to create what you desire.',
      },
      reversed: {
        vi: 'Thao túng, tiềm năng chưa khai phá, ảo tưởng. Hãy trung thực với bản thân.',
        en: 'Manipulation, untapped potential, illusion. Be honest with yourself.',
      },
    },
  },
  {
    id: 'priestess',
    name: { vi: 'The High Priestess', en: 'The High Priestess' },
    hue: 260, // deep violet
    symbol: 'priestess',
    meaning: {
      upright: {
        vi: 'Trực giác, sự bí ẩn, tiềm thức. Lắng nghe tiếng nói bên trong — câu trả lời đang ở đó.',
        en: 'Intuition, mystery, the subconscious. Listen to the inner voice — the answer is already there.',
      },
      reversed: {
        vi: 'Bí mật bị che giấu, trực giác bị chặn, mất kết nối với bản thân.',
        en: 'Hidden secrets, blocked intuition, disconnection from self.',
      },
    },
  },
  {
    id: 'star',
    name: { vi: 'The Star', en: 'The Star' },
    hue: 190, // cyan-violet
    symbol: 'star',
    meaning: {
      upright: {
        vi: 'Hy vọng, sự chữa lành, cảm hứng thiêng liêng. Ánh sáng đang trở lại sau bóng tối.',
        en: 'Hope, healing, divine inspiration. Light returns after the dark.',
      },
      reversed: {
        vi: 'Mất hy vọng, bi quan, thiếu niềm tin. Hãy tìm lại ngọn lửa bên trong.',
        en: 'Loss of hope, despair, lack of faith. Rekindle the inner flame.',
      },
    },
  },
  {
    id: 'moon',
    name: { vi: 'The Moon', en: 'The Moon' },
    hue: 230, // moonlit blue
    symbol: 'moon',
    meaning: {
      upright: {
        vi: 'Ảo ảnh, nỗi sợ tiềm thức, giấc mơ. Điều gì đó chưa được nhìn thấy rõ ràng.',
        en: 'Illusion, subconscious fear, dreams. Something is not yet seen clearly.',
      },
      reversed: {
        vi: 'Sự giải thoát khỏi ảo ảnh, sự thật hé lộ, minh mẫn trở về.',
        en: 'Release from illusion, truth revealed, clarity returning.',
      },
    },
  },
  {
    id: 'sun',
    name: { vi: 'The Sun', en: 'The Sun' },
    hue: 38, // warm gold
    symbol: 'sun',
    meaning: {
      upright: {
        vi: 'Niềm vui, thành công, sức sống. Mọi thứ đang nở rộ theo đúng hướng.',
        en: 'Joy, success, vitality. All is blooming in the right direction.',
      },
      reversed: {
        vi: 'Lạc quan thái quá, niềm vui bị trì hoãn, thiếu rõ ràng.',
        en: 'Excessive optimism, delayed joy, lack of clarity.',
      },
    },
  },
  {
    id: 'tower',
    name: { vi: 'The Tower', en: 'The Tower' },
    hue: 10, // ember red
    symbol: 'tower',
    meaning: {
      upright: {
        vi: 'Biến động, sự đổ vỡ cần thiết, khải ngộ bất ngờ. Cấu trúc cũ phải sụp để cái mới trỗi dậy.',
        en: 'Upheaval, necessary collapse, sudden revelation. Old structures must fall for the new to rise.',
      },
      reversed: {
        vi: 'Tránh né thảm họa, thay đổi nội tâm, sợ hãi sự sụp đổ.',
        en: 'Averted disaster, inner change, fear of collapse.',
      },
    },
  },
  {
    id: 'lovers',
    name: { vi: 'The Lovers', en: 'The Lovers' },
    hue: 340, // rose-violet
    symbol: 'lovers',
    meaning: {
      upright: {
        vi: 'Tình yêu, sự hòa hợp, lựa chọn quan trọng. Hai linh hồn gặp nhau trong sự chân thật.',
        en: 'Love, harmony, important choice. Two souls meet in truth.',
      },
      reversed: {
        vi: 'Mất cân bằng, lựa chọn sai, bất hòa trong mối quan hệ.',
        en: 'Imbalance, wrong choice, relational discord.',
      },
    },
  },
  {
    id: 'hermit',
    name: { vi: 'The Hermit', en: 'The Hermit' },
    hue: 50, // muted gold
    symbol: 'hermit',
    meaning: {
      upright: {
        vi: 'Tìm kiếm bên trong, cô độc thiêng liêng, trí tuệ. Thời điểm để rút lui và lắng nghe.',
        en: 'Inner search, sacred solitude, wisdom. A time to withdraw and listen.',
      },
      reversed: {
        vi: 'Cô lập, né tránh sự thật, cô đơn kéo dài.',
        en: 'Isolation, avoidance of truth, prolonged loneliness.',
      },
    },
  },
  {
    id: 'wheel',
    name: { vi: 'Wheel of Fortune', en: 'Wheel of Fortune' },
    hue: 280, // violet
    symbol: 'wheel',
    meaning: {
      upright: {
        vi: 'Vòng xoay số phận, thay đổi, may mắn. Chu kỳ mới đang bắt đầu.',
        en: 'The turning wheel, change, fortune. A new cycle begins.',
      },
      reversed: {
        vi: 'Vận rủi, cưỡng lại dòng chảy, chu kỳ khó khăn.',
        en: 'Bad luck, resisting the flow, difficult cycle.',
      },
    },
  },
  {
    id: 'death',
    name: { vi: 'Death', en: 'Death' },
    hue: 300, // dark violet-magenta
    symbol: 'death',
    meaning: {
      upright: {
        vi: 'Kết thúc để bắt đầu, chuyển hóa sâu sắc, buông bỏ. Một chương đang khép lại.',
        en: 'Endings, deep transformation, letting go. A chapter is closing.',
      },
      reversed: {
        vi: 'Kháng cự thay đổi, trì trệ, sợ buông tay.',
        en: 'Resistance to change, stagnation, fear of release.',
      },
    },
  },
  {
    id: 'world',
    name: { vi: 'The World', en: 'The World' },
    hue: 160, // teal-green
    symbol: 'world',
    meaning: {
      upright: {
        vi: 'Hoàn thành, trọn vẹn, thành tựu. Vòng tròn đã khép, một hành trình đã hoàn tất.',
        en: 'Completion, wholeness, accomplishment. The circle closes, a journey fulfilled.',
      },
      reversed: {
        vi: 'Chưa hoàn thành, thiếu kết thúc, hành trình dang dở.',
        en: 'Incomplete, lacking closure, unfinished journey.',
      },
    },
  },
];

window.TAROT_CARDS = TAROT_CARDS;

// Position labels
window.TAROT_POSITIONS = {
  1: {
    vi: ['Thông điệp'],
    en: ['Message'],
  },
  3: {
    vi: ['Quá khứ', 'Hiện tại', 'Lời khuyên'],
    en: ['Past', 'Present', 'Guidance'],
  },
  4: {
    vi: ['Bản thân', 'Ngoại cảnh', 'Bài học', 'Hành động'],
    en: ['Self', 'Surroundings', 'Lesson', 'Action'],
  },
};

// i18n strings
window.I18N = {
  vi: {
    homeMessage: 'Hãy tập trung, hít thở sâu\nvà suy nghĩ về điều bạn muốn biết',
    spread1: 'Trải bài 1 lá',
    spread3: 'Trải bài 3 lá',
    spread4: 'Trải bài 4 lá',
    spread1Sub: 'Một thông điệp duy nhất',
    spread3Sub: 'Quá khứ · Hiện tại · Lời khuyên',
    spread4Sub: 'Bản thân · Ngoại cảnh · Bài học · Hành động',
    shuffling: 'Đang kết nối với năng lượng của bạn...',
    tapToSkip: 'Chạm để bỏ qua',
    tapToReveal: 'Chạm vào lá bài để lật',
    tapForNext: 'Chạm để tiếp tục',
    orientation: { upright: 'Xuôi', reversed: 'Ngược' },
    cardOf: (i, n) => `Lá ${i} trong ${n}`,
    reading: 'Lời giải bài',
    insight: 'Cảm nhận',
    interpretation: 'Diễn giải tổng thể',
    newReading: 'Trải bài mới',
    home: 'Trang chủ',
    donate: 'Ủng hộ',
    donateTitle: 'Ủng hộ dự án',
    donateMsg: 'Mọi đóng góp của bạn giúp dự án tiếp tục mang ánh sáng đến nhiều tâm hồn hơn. Chân thành cảm ơn bạn.',
    donateConfirm: 'Gửi tấm lòng',
    chooseAmount: 'Chọn số tiền',
    thankyou: 'Cảm ơn bạn',
    thankyouSub: 'Ánh sáng của bạn đã được đón nhận.',
    back: 'Quay lại',
  },
  en: {
    homeMessage: 'Focus, breathe deeply,\nand reflect on what you seek',
    spread1: '1-Card Reading',
    spread3: '3-Card Reading',
    spread4: '4-Card Reading',
    spread1Sub: 'A single message',
    spread3Sub: 'Past · Present · Guidance',
    spread4Sub: 'Self · Surroundings · Lesson · Action',
    shuffling: 'Connecting with your energy...',
    tapToSkip: 'Tap to skip',
    tapToReveal: 'Tap the card to flip',
    tapForNext: 'Tap to continue',
    orientation: { upright: 'Upright', reversed: 'Reversed' },
    cardOf: (i, n) => `Card ${i} of ${n}`,
    reading: 'Your reading',
    insight: 'Feeling',
    interpretation: 'Full interpretation',
    newReading: 'New reading',
    home: 'Home',
    donate: 'Donate',
    donateTitle: 'Support the project',
    donateMsg: 'Every contribution helps this project bring light to more souls. Thank you, sincerely.',
    donateConfirm: 'Offer gratitude',
    chooseAmount: 'Choose an amount',
    thankyou: 'Thank you',
    thankyouSub: 'Your light has been received.',
    back: 'Back',
  },
};

// Insight templates (short emotional summaries based on drawn cards)
window.INSIGHT_TEMPLATES = {
  vi: [
    'Một bước chuyển nhỏ đang âm thầm diễn ra trong bạn.',
    'Hãy tin vào những gì trái tim đang thì thầm.',
    'Bóng tối không phải kẻ thù — nó là người dẫn đường.',
    'Điều bạn tìm kiếm cũng đang tìm kiếm bạn.',
    'Ánh sáng sẽ đến, nhưng cần sự kiên nhẫn.',
  ],
  en: [
    'A quiet shift is moving through you.',
    'Trust what the heart is whispering.',
    'The dark is not an enemy — it is a guide.',
    'What you seek is also seeking you.',
    'Light will come, but patience is required.',
  ],
};
