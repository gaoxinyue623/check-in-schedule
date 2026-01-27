import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { learningPlan } from './learningPlan'

export const useScheduleStore = defineStore('schedule', () => {
  // 礼品列表（更有益于孩子成长的奖励）
  const gifts = ref([
    { id: 1, name: '益智玩具', stars: 10, icon: '🧩', redeemed: 0 },
    { id: 2, name: '去图书馆', stars: 15, icon: '📚', redeemed: 0 },
    { id: 3, name: '新绘本', stars: 20, icon: '📖', redeemed: 0 },
    { id: 4, name: '科学实验套装', stars: 25, icon: '🔬', redeemed: 0 },
    { id: 5, name: '去博物馆', stars: 30, icon: '🏛️', redeemed: 0 },
    { id: 6, name: '户外野餐', stars: 35, icon: '🧺', redeemed: 0 },
    { id: 7, name: '美术用品', stars: 18, icon: '🎨', redeemed: 0 },
    { id: 8, name: '乐高积木', stars: 40, icon: '🧱', redeemed: 0 },
    { id: 9, name: '去动物园', stars: 45, icon: '🦁', redeemed: 0 },
    { id: 10, name: '体育用品', stars: 22, icon: '⚽', redeemed: 0 }
  ])

  // 4周的计划（28天，从1月24日开始）
  const monthSchedule = ref([])

  // 当前选中的日期索引（0-27代表28天）
  const currentDayIndex = ref(0)

  // 总星星数
  const totalStars = ref(0)

  // 生成某一天的任务列表
  const generateDayTasks = (dayNumber) => {
    const chineseContent = learningPlan.chinese[dayNumber - 1]
    const mathContent = learningPlan.math[dayNumber - 1]
    const englishContent = learningPlan.english[dayNumber - 1]

    // 第1天（1月26日）特殊安排：没有舞蹈课
    if (dayNumber === 1) {
      return [
        { id: 1, time: '08:30-09:00', activity: '起床洗漱', description: '刷牙、洗脸、整理床铺\n自己叠被子、整理房间', category: 'daily', completed: false },
        { id: 2, time: '09:00-09:30', activity: '早餐时间', description: '营养早餐，细嚼慢咽\n吃完后自己收拾碗筷', category: 'daily', completed: false },
        {
          id: 3,
          time: '09:30-10:15',
          activity: '✏️ 语文学习',
          description: `【第${dayNumber}天】\n1. 《同步教材字帖》写一课\n2. 阅读《一本》上的一篇文章\n3. 看图写话或背诵古诗`,
          category: 'study',
          completed: false,
          stars: 3
        },
        { id: 4, time: '10:15-10:30', activity: '休息时间', description: '喝水、上厕所、眼保健操\n到阳台或窗边看看远处', category: 'break', completed: false },
        {
          id: 5,
          time: '10:30-11:15',
          activity: '➕ 数学学习',
          description: `【第${dayNumber}天】\n1. 《应用题》一页\n2. 《奥数》两个课时`,
          category: 'study',
          completed: false,
          stars: 3
        },
        { id: 6, time: '11:15-12:00', activity: '自由活动', description: '玩玩具、画画、听音乐\n可以玩益智玩具或手工', category: 'break', completed: false },
        { id: 7, time: '12:00-12:30', activity: '午餐时间', description: '好好吃饭，不挑食\n吃完后自己收拾碗筷', category: 'daily', completed: false },
        {
          id: 8,
          time: '12:30-13:30',
          activity: '🌤️ 英语学习',
          description: `【第${dayNumber}天】\n1. 《一本》字帖一页\n2. 阅读英语课外书籍（借助点读笔）\n${dayNumber % 3 === 1 ? '3. 看一部英文动画电影或学习一首英文歌曲' : ''}`,
          category: 'study',
          completed: false,
          stars: 2
        },
        {
          id: 9,
          time: '13:30-14:00',
          activity: '🧠 思维训练',
          description: '【选做一项】\n1. 数独游戏（4×4或6×6）\n2. 找规律题目（3-5题）\n3. 走迷宫（培养空间思维）\n4. 积木搭建（按图纸或自由创作）',
          category: 'study',
          completed: false,
          stars: 1
        },
        { id: 10, time: '14:00-17:00', activity: '自由活动', description: '玩玩具、画画、听音乐\n可以玩益智玩具或手工\n可以适当休息', category: 'break', completed: false },
        {
          id: 11,
          time: '17:00-17:30',
          activity: '🏃 户外运动',
          description: '【选做一项】\n1. 跳绳100个（分组完成）\n2. 摸高跳20次\n3. 户外跑步或骑车\n4. 拍球、踢球等球类运动\n目标：运动到微微出汗',
          category: 'sport',
          completed: false,
          stars: 2
        },
        {
          id: 12,
          time: '17:30-18:00',
          activity: '🧹 家务劳动',
          description: '【每日必做，选做一项】\n1. 整理自己的书包和文具\n2. 叠自己的衣服\n3. 帮忙摆碗筷、收拾餐桌\n4. 整理玩具和房间\n5. 给植物浇水',
          category: 'housework',
          completed: false,
          stars: 2
        },
        { id: 13, time: '18:00-18:30', activity: '晚餐准备', description: '洗手、帮忙摆碗筷\n学习摆放餐具的正确位置', category: 'daily', completed: false },
        { id: 14, time: '18:30-19:00', activity: '晚餐时间', description: '和家人一起吃饭聊天\n分享今天的收获和快乐', category: 'daily', completed: false },
        {
          id: 15,
          time: '19:00-19:30',
          activity: '📚 复习巩固',
          description: `【第${dayNumber}天复习】\n1. 复习今天学的生字（读写）\n2. 复习数学题目\n3. 复习英语单词`,
          category: 'reading',
          completed: false,
          stars: 2
        },
        { id: 16, time: '19:30-20:00', activity: '自由活动', description: '看动画片、玩游戏\n可以看教育类动画片', category: 'break', completed: false },
        { id: 17, time: '20:00-20:30', activity: '洗漱时间', description: '洗澡、刷牙、准备睡觉\n学习独立洗漱', category: 'daily', completed: false },
        {
          id: 18,
          time: '20:30-21:00',
          activity: '🌙 睡前阅读',
          description: '【每日必做】\n1. 听爸爸妈妈讲故事\n2. 或自己看绘本\n3. 学习复述故事\n4. 培养良好的阅读习惯',
          category: 'reading',
          completed: false,
          stars: 1
        },
        { id: 19, time: '21:00', activity: '💤 准时睡觉', description: '晚安，做个好梦\n保证充足睡眠，明天更有精神', category: 'daily', completed: false }
      ]
    }

    // 第5天（1月30日）特殊安排：上午散学典礼
    if (dayNumber === 5) {
      return [
        { id: 1, time: '07:30-08:00', activity: '起床洗漱', description: '今天要去学校参加散学典礼\n刷牙、洗脸、整理床铺', category: 'daily', completed: false },
        { id: 2, time: '08:00-08:30', activity: '早餐时间', description: '营养早餐，细嚼慢咽\n吃完后准备出门', category: 'daily', completed: false },
        {
          id: 3,
          time: '08:30-12:00',
          activity: '🏫 散学典礼',
          description: '【重要活动】\n1. 准时到校\n2. 认真听老师讲话\n3. 领取成绩单和奖状\n4. 与同学老师告别\n5. 注意安全',
          category: 'study',
          completed: false,
          stars: 3
        },
        { id: 4, time: '12:00-12:30', activity: '午餐时间', description: '好好吃饭，不挑食\n吃完后自己收拾碗筷', category: 'daily', completed: false },
        { id: 5, time: '12:30-13:00', activity: '午餐后休息', description: '休息一下，消化消化\n可以看看书或听音乐', category: 'break', completed: false },
        {
          id: 6,
          time: '13:00-14:00',
          activity: '🌤️ 英语学习',
          description: `【第${dayNumber}天】\n1. 《一本》字帖一页\n2. 阅读英语课外书籍（借助点读笔）`,
          category: 'study',
          completed: false,
          stars: 2
        },
        {
          id: 7,
          time: '14:00-14:30',
          activity: '🧠 思维训练',
          description: '【选做一项】\n1. 数独游戏（4×4或6×6）\n2. 找规律题目（3-5题）\n3. 走迷宫（培养空间思维）\n4. 积木搭建（按图纸或自由创作）',
          category: 'study',
          completed: false,
          stars: 1
        },
        { id: 8, time: '14:30-15:00', activity: '准备去跳舞', description: '换衣服、带好水壶\n检查舞蹈用品是否齐全', category: 'daily', completed: false },
        {
          id: 9,
          time: '15:00-16:30',
          activity: '💃 跳舞课',
          description: '【每日必做】\n1. 认真听老师讲解\n2. 跟着音乐做动作\n3. 练习基本功（压腿、下腰等）\n4. 学习新舞蹈动作',
          category: 'sport',
          completed: false,
          stars: 3
        },
        { id: 10, time: '16:30-17:00', activity: '回家休息', description: '喝水、换衣服、吃点水果\n休息一下恢复体力', category: 'break', completed: false },
        {
          id: 11,
          time: '17:00-17:30',
          activity: '🏃 户外运动',
          description: '【选做一项】\n1. 跳绳100个（分组完成）\n2. 摸高跳20次\n3. 户外跑步或骑车\n4. 拍球、踢球等球类运动\n目标：运动到微微出汗',
          category: 'sport',
          completed: false,
          stars: 2
        },
        {
          id: 12,
          time: '17:30-18:00',
          activity: '🧹 家务劳动',
          description: '【每日必做，选做一项】\n1. 整理自己的书包和文具\n2. 叠自己的衣服\n3. 帮忙摆碗筷、收拾餐桌\n4. 整理玩具和房间\n5. 给植物浇水',
          category: 'housework',
          completed: false,
          stars: 2
        },
        { id: 13, time: '18:00-18:30', activity: '晚餐准备', description: '洗手、帮忙摆碗筷\n学习摆放餐具的正确位置', category: 'daily', completed: false },
        { id: 14, time: '18:30-18:50', activity: '晚餐时间', description: '和家人一起吃饭聊天\n分享今天的收获和快乐', category: 'daily', completed: false },
        {
          id: 15,
          time: '18:50-19:30',
          activity: '📱 锦书在线课程',
          description: '【线上课程】\n1. 准备好平板\n2. 认真听课\n3. 做好笔记\n4. 积极互动',
          category: 'study',
          completed: false,
          stars: 2
        },
        {
          id: 16,
          time: '19:30-20:00',
          activity: '📚 复习巩固',
          description: `【第${dayNumber}天复习】\n1. 复习今天学的生字（读写）\n2. 复习数学题目\n3. 复习英语单词`,
          category: 'reading',
          completed: false,
          stars: 2
        },
        { id: 17, time: '20:00-20:30', activity: '洗漱时间', description: '洗澡、刷牙、准备睡觉\n学习独立洗漱', category: 'daily', completed: false },
        {
          id: 18,
          time: '20:30-21:00',
          activity: '🌙 睡前阅读',
          description: '【每日必做】\n1. 听爸爸妈妈讲故事\n2. 或自己看绘本\n3. 学习复述故事\n4. 培养良好的阅读习惯',
          category: 'reading',
          completed: false,
          stars: 1
        },
        { id: 19, time: '21:00', activity: '💤 准时睡觉', description: '晚安，做个好梦\n保证充足睡眠，明天更有精神', category: 'daily', completed: false }
      ]
    }

    // 第2-14天（1月27日-2月8日）：有舞蹈课的安排（3:00-4:30）
    if (dayNumber >= 2 && dayNumber <= 14) {
      const hasOnlineCourse = dayNumber >= 4 && dayNumber <= 8 // 1月29日-2月1日（第4-8天）

      return [
        { id: 1, time: '08:30-09:00', activity: '起床洗漱', description: '刷牙、洗脸、整理床铺\n自己叠被子、整理房间', category: 'daily', completed: false },
        { id: 2, time: '09:00-09:30', activity: '早餐时间', description: '营养早餐，细嚼慢咽\n吃完后自己收拾碗筷', category: 'daily', completed: false },
        {
          id: 3,
          time: '09:30-10:15',
          activity: '✏️ 语文学习',
          description: `【第${dayNumber}天】\n1. 《同步教材字帖》写一课\n2. 阅读《一本》上的一篇文章\n3. 看图写话或背诵古诗`,
          category: 'study',
          completed: false,
          stars: 3
        },
        { id: 4, time: '10:15-10:30', activity: '休息时间', description: '喝水、上厕所、眼保健操\n到阳台或窗边看看远处', category: 'break', completed: false },
        {
          id: 5,
          time: '10:30-11:15',
          activity: '➕ 数学学习',
          description: `【第${dayNumber}天】\n1. 《应用题》一页\n2. 《奥数》两个课时`,
          category: 'study',
          completed: false,
          stars: 3
        },
        { id: 6, time: '11:15-12:00', activity: '自由活动', description: '玩玩具、画画、听音乐\n可以玩益智玩具或手工', category: 'break', completed: false },
        { id: 7, time: '12:00-12:30', activity: '午餐时间', description: '好好吃饭，不挑食\n吃完后自己收拾碗筷', category: 'daily', completed: false },
        { id: 8, time: '12:30-13:00', activity: '午餐后休息', description: '休息一下，消化消化\n可以看看书或听音乐', category: 'break', completed: false },
        {
          id: 9,
          time: '13:00-14:00',
          activity: '🌤️ 英语学习',
          description: `【第${dayNumber}天】\n1. 《一本》字帖一页\n2. 阅读英语课外书籍（借助点读笔）\n${dayNumber % 3 === 1 ? '3. 看一部英文动画电影或学习一首英文歌曲' : ''}`,
          category: 'study',
          completed: false,
          stars: 2
        },
        {
          id: 10,
          time: '14:00-14:30',
          activity: '🧠 思维训练',
          description: '【选做一项】\n1. 数独游戏（4×4或6×6）\n2. 找规律题目（3-5题）\n3. 走迷宫（培养空间思维）\n4. 积木搭建（按图纸或自由创作）',
          category: 'study',
          completed: false,
          stars: 1
        },
        { id: 11, time: '14:30-15:00', activity: '准备去跳舞', description: '换衣服、带好水壶\n检查舞蹈用品是否齐全', category: 'daily', completed: false },
        {
          id: 12,
          time: '15:00-16:30',
          activity: '💃 跳舞课',
          description: '【每日必做】\n1. 认真听老师讲解\n2. 跟着音乐做动作\n3. 练习基本功（压腿、下腰等）\n4. 学习新舞蹈动作',
          category: 'sport',
          completed: false,
          stars: 3
        },
        { id: 13, time: '16:30-17:00', activity: '回家休息', description: '喝水、换衣服、吃点水果\n休息一下恢复体力', category: 'break', completed: false },
        {
          id: 14,
          time: '17:00-17:30',
          activity: '🏃 户外运动',
          description: '【选做一项】\n1. 跳绳100个（分组完成）\n2. 摸高跳20次\n3. 户外跑步或骑车\n4. 拍球、踢球等球类运动\n目标：运动到微微出汗',
          category: 'sport',
          completed: false,
          stars: 2
        },
        {
          id: 15,
          time: '17:30-18:00',
          activity: '🧹 家务劳动',
          description: '【每日必做，选做一项】\n1. 整理自己的书包和文具\n2. 叠自己的衣服\n3. 帮忙摆碗筷、收拾餐桌\n4. 整理玩具和房间\n5. 给植物浇水',
          category: 'housework',
          completed: false,
          stars: 2
        },
        { id: 16, time: '18:00-18:30', activity: '晚餐准备', description: '洗手、帮忙摆碗筷\n学习摆放餐具的正确位置', category: 'daily', completed: false },
        { id: 17, time: '18:30-18:50', activity: '晚餐时间', description: '和家人一起吃饭聊天\n分享今天的收获和快乐', category: 'daily', completed: false },
        ...(hasOnlineCourse ? [
          {
            id: 18,
            time: '18:50-19:30',
            activity: '📱 锦书在线课程',
            description: '【线上课程】\n1. 准备好平板\n2. 认真听课\n3. 做好笔记\n4. 积极互动',
            category: 'study',
            completed: false,
            stars: 2
          },
          {
            id: 19,
            time: '19:30-20:00',
            activity: '📚 复习巩固',
            description: `【第${dayNumber}天复习】\n1. 复习今天学的生字（读写）\n2. 复习数学题目\n3. 复习英语单词`,
            category: 'reading',
            completed: false,
            stars: 2
          },
          { id: 20, time: '20:00-20:30', activity: '洗漱时间', description: '洗澡、刷牙、准备睡觉\n学习独立洗漱', category: 'daily', completed: false },
          {
            id: 21,
            time: '20:30-21:00',
            activity: '🌙 睡前阅读',
            description: '【每日必做】\n1. 听爸爸妈妈讲故事\n2. 或自己看绘本\n3. 学习复述故事\n4. 培养良好的阅读习惯',
            category: 'reading',
            completed: false,
            stars: 1
          },
          { id: 22, time: '21:00', activity: '💤 准时睡觉', description: '晚安，做个好梦\n保证充足睡眠，明天更有精神', category: 'daily', completed: false }
        ] : [
          {
            id: 18,
            time: '18:50-19:30',
            activity: '📚 复习巩固',
            description: `【第${dayNumber}天复习】\n1. 复习今天学的生字（读写）\n2. 复习数学题目\n3. 复习英语单词`,
            category: 'reading',
            completed: false,
            stars: 2
          },
          { id: 19, time: '19:30-20:00', activity: '自由活动', description: '看动画片、玩游戏\n可以看教育类动画片', category: 'break', completed: false },
          { id: 20, time: '20:00-20:30', activity: '洗漱时间', description: '洗澡、刷牙、准备睡觉\n学习独立洗漱', category: 'daily', completed: false },
          {
            id: 21,
            time: '20:30-21:00',
            activity: '🌙 睡前阅读',
            description: '【每日必做】\n1. 听爸爸妈妈讲故事\n2. 或自己看绘本\n3. 学习复述故事\n4. 培养良好的阅读习惯',
            category: 'reading',
            completed: false,
            stars: 1
          },
          { id: 22, time: '21:00', activity: '💤 准时睡觉', description: '晚安，做个好梦\n保证充足睡眠，明天更有精神', category: 'daily', completed: false }
        ])
      ]
    }

    // 第15天及以后（2月9日开始）：没有舞蹈课的安排
    if (dayNumber >= 15) {
      return [
        { id: 1, time: '08:30-09:00', activity: '起床洗漱', description: '刷牙、洗脸、整理床铺\n自己叠被子、整理房间', category: 'daily', completed: false },
        { id: 2, time: '09:00-09:30', activity: '早餐时间', description: '营养早餐，细嚼慢咽\n吃完后自己收拾碗筷', category: 'daily', completed: false },
        {
          id: 3,
          time: '09:30-10:15',
          activity: '✏️ 语文学习',
          description: `【第${dayNumber}天】\n1. 《同步教材字帖》写一课\n2. 阅读《一本》上的一篇文章\n3. 看图写话或背诵古诗`,
          category: 'study',
          completed: false,
          stars: 3
        },
        { id: 4, time: '10:15-10:30', activity: '休息时间', description: '喝水、上厕所、眼保健操\n到阳台或窗边看看远处', category: 'break', completed: false },
        {
          id: 5,
          time: '10:30-11:15',
          activity: '➕ 数学学习',
          description: `【第${dayNumber}天】\n1. 《应用题》一页\n2. 《奥数》两个课时`,
          category: 'study',
          completed: false,
          stars: 3
        },
        { id: 6, time: '11:15-12:00', activity: '自由活动', description: '玩玩具、画画、听音乐\n可以玩益智玩具或手工', category: 'break', completed: false },
        { id: 7, time: '12:00-12:30', activity: '午餐时间', description: '好好吃饭，不挑食\n吃完后自己收拾碗筷', category: 'daily', completed: false },
        { id: 8, time: '12:30-13:00', activity: '午餐后休息', description: '休息一下，消化消化\n可以看看书或听音乐', category: 'break', completed: false },
        {
          id: 9,
          time: '13:00-14:00',
          activity: '🌤️ 英语学习',
          description: `【第${dayNumber}天】\n1. 《一本》字帖一页\n2. 阅读英语课外书籍（借助点读笔）\n${dayNumber % 3 === 1 ? '3. 看一部英文动画电影或学习一首英文歌曲' : ''}`,
          category: 'study',
          completed: false,
          stars: 2
        },
        {
          id: 10,
          time: '14:00-14:30',
          activity: '🧠 思维训练',
          description: '【选做一项】\n1. 数独游戏（4×4或6×6）\n2. 找规律题目（3-5题）\n3. 走迷宫（培养空间思维）\n4. 积木搭建（按图纸或自由创作）',
          category: 'study',
          completed: false,
          stars: 1
        },
        { id: 11, time: '14:30-17:00', activity: '自由活动', description: '玩玩具、画画、听音乐\n可以玩益智玩具或手工\n可以适当休息', category: 'break', completed: false },
        {
          id: 12,
          time: '17:00-17:30',
          activity: '🏃 户外运动',
          description: '【选做一项】\n1. 跳绳100个（分组完成）\n2. 摸高跳20次\n3. 户外跑步或骑车\n4. 拍球、踢球等球类运动\n目标：运动到微微出汗',
          category: 'sport',
          completed: false,
          stars: 2
        },
        {
          id: 13,
          time: '17:30-18:00',
          activity: '🧹 家务劳动',
          description: '【每日必做，选做一项】\n1. 整理自己的书包和文具\n2. 叠自己的衣服\n3. 帮忙摆碗筷、收拾餐桌\n4. 整理玩具和房间\n5. 给植物浇水',
          category: 'housework',
          completed: false,
          stars: 2
        },
        { id: 14, time: '18:00-18:30', activity: '晚餐准备', description: '洗手、帮忙摆碗筷\n学习摆放餐具的正确位置', category: 'daily', completed: false },
        { id: 15, time: '18:30-19:00', activity: '晚餐时间', description: '和家人一起吃饭聊天\n分享今天的收获和快乐', category: 'daily', completed: false },
        {
          id: 16,
          time: '19:00-19:30',
          activity: '📚 复习巩固',
          description: `【第${dayNumber}天复习】\n1. 复习今天学的生字（读写）\n2. 复习数学题目\n3. 复习英语单词`,
          category: 'reading',
          completed: false,
          stars: 2
        },
        { id: 17, time: '19:30-20:00', activity: '自由活动', description: '看动画片、玩游戏\n可以看教育类动画片', category: 'break', completed: false },
        { id: 18, time: '20:00-20:30', activity: '洗漱时间', description: '洗澡、刷牙、准备睡觉\n学习独立洗漱', category: 'daily', completed: false },
        {
          id: 19,
          time: '20:30-21:00',
          activity: '🌙 睡前阅读',
          description: '【每日必做】\n1. 听爸爸妈妈讲故事\n2. 或自己看绘本\n3. 学习复述故事\n4. 培养良好的阅读习惯',
          category: 'reading',
          completed: false,
          stars: 1
        },
        { id: 20, time: '21:00', activity: '💤 准时睡觉', description: '晚安，做个好梦\n保证充足睡眠，明天更有精神', category: 'daily', completed: false }
      ]
    }

    // 春节期间（第24天 2月16日 和 第25天 2月17日）：轻松安排
    if (dayNumber === 24 || dayNumber === 25) {
      const dayLabel = dayNumber === 24 ? '大年初九' : '大年初十'
      return [
        { id: 1, time: '08:00-09:00', activity: '起床洗漱', description: '春节期间可以稍微晚起\n刷牙、洗脸、整理床铺', category: 'daily', completed: false },
        { id: 2, time: '09:00-09:30', activity: '早餐时间', description: '营养早餐，细嚼慢咽\n吃完后自己收拾碗筷', category: 'daily', completed: false },
        {
          id: 3,
          time: '09:30-10:00',
          activity: '📖 轻松阅读',
          description: `【${dayLabel}特别安排】\n1. 看自己喜欢的绘本\n2. 或者听故事\n3. 轻松愉快，不用太认真`,
          category: 'reading',
          completed: false,
          stars: 1
        },
        { id: 4, time: '10:00-12:00', activity: '🎉 春节活动', description: '【春节特别安排】\n1. 和家人一起玩游戏\n2. 看春节节目\n3. 走亲访友\n4. 享受假期时光', category: 'break', completed: false },
        { id: 5, time: '12:00-13:00', activity: '午餐时间', description: '品尝美味的春节美食\n和家人一起享用', category: 'daily', completed: false },
        { id: 6, time: '13:00-15:00', activity: '午休时间', description: '睡个好觉，养足精神\n春节也要保持良好作息', category: 'daily', completed: false },
        {
          id: 7,
          time: '15:00-17:00',
          activity: '🎊 家庭娱乐',
          description: '【春节特别活动】\n1. 和家人一起做游戏\n2. 看电影或动画片\n3. 做手工、画画\n4. 玩益智玩具',
          category: 'break',
          completed: false,
          stars: 1
        },
        {
          id: 8,
          time: '17:00-17:30',
          activity: '🏃 户外活动',
          description: '【选做】\n1. 到户外走走\n2. 和小朋友一起玩\n3. 放松心情',
          category: 'sport',
          completed: false,
          stars: 1
        },
        { id: 9, time: '17:30-18:30', activity: '自由活动', description: '做自己喜欢的事情\n享受快乐时光', category: 'break', completed: false },
        { id: 10, time: '18:30-19:30', activity: '晚餐时间', description: '和家人一起吃年夜饭\n分享今天的快乐', category: 'daily', completed: false },
        { id: 11, time: '19:30-20:30', activity: '🎆 春节娱乐', description: '【春节特别时光】\n1. 看春晚或节目\n2. 和家人聊天\n3. 玩游戏\n4. 享受团圆时光', category: 'break', completed: false },
        { id: 12, time: '20:30-21:00', activity: '洗漱时间', description: '洗澡、刷牙、准备睡觉\n保持良好卫生习惯', category: 'daily', completed: false },
        {
          id: 13,
          time: '21:00-21:30',
          activity: '🌙 睡前故事',
          description: '【轻松时光】\n1. 听爸爸妈妈讲故事\n2. 或自己看绘本\n3. 放松心情，准备睡觉',
          category: 'reading',
          completed: false,
          stars: 1
        },
        { id: 14, time: '21:30', activity: '💤 准时睡觉', description: '晚安，做个好梦\n春节也要保证充足睡眠', category: 'daily', completed: false }
      ]
    }

    // 默认返回（不应该到达这里）
    return [
      { id: 1, time: '08:00-08:30', activity: '起床洗漱', description: '刷牙、洗脸、整理床铺\n自己叠被子、整理房间', category: 'daily', completed: false },
      { id: 2, time: '08:30-09:00', activity: '早餐时间', description: '营养早餐，细嚼慢咽\n吃完后自己收拾碗筷', category: 'daily', completed: false },
      {
        id: 3,
        time: '09:00-09:30',
        activity: '✏️ 语文学习（20-30分钟）',
        description: `【第${dayNumber}天】\n${chineseContent.content}`,
        category: 'study',
        completed: false,
        stars: 2
      },
      {
        id: 4,
        time: '09:30-10:00',
        activity: '➕ 数学学习（20-30分钟）',
        description: `【第${dayNumber}天】\n${mathContent.content}`,
        category: 'study',
        completed: false,
        stars: 2
      },
      { id: 5, time: '10:00-10:30', activity: '休息时间', description: '喝水、上厕所、眼保健操\n到阳台或窗边看看远处', category: 'break', completed: false },
      {
        id: 6,
        time: '10:30-11:00',
        activity: '🌤️ 英语学习（15-20分钟）',
        description: `【第${dayNumber}天】\n${englishContent.content}`,
        category: 'study',
        completed: false,
        stars: 2
      },
      {
        id: 7,
        time: '11:00-11:30',
        activity: '🧠 思维训练（15-20分钟）',
        description: '【选做一项】\n1. 数独游戏（4×4或6×6）\n2. 找规律题目（3-5题）\n3. 走迷宫（培养空间思维）\n4. 积木搭建（按图纸或自由创作）',
        category: 'study',
        completed: false,
        stars: 1
      },
      { id: 8, time: '11:30-12:00', activity: '自由活动', description: '玩玩具、画画、听音乐\n可以玩益智玩具或手工', category: 'break', completed: false },
      { id: 9, time: '12:00-12:30', activity: '午餐准备', description: '洗手、帮忙摆碗筷\n学习摆放餐具的正确位置', category: 'daily', completed: false },
      { id: 10, time: '12:30-13:00', activity: '午餐时间', description: '好好吃饭，不挑食\n学习使用筷子，饭后漱口', category: 'daily', completed: false },
      { id: 11, time: '13:00-15:00', activity: '午休时间', description: '睡个好觉，养足精神\n至少休息1小时', category: 'daily', completed: false },
      { id: 12, time: '15:00-15:30', activity: '准备去跳舞', description: '换衣服、带好水壶\n检查舞蹈用品是否齐全', category: 'daily', completed: false },
      {
        id: 13,
        time: '15:30-17:00',
        activity: '💃 跳舞课',
        description: '【每日必做】\n1. 认真听老师讲解\n2. 跟着音乐做动作\n3. 练习基本功（压腿、下腰等）\n4. 学习新舞蹈动作',
        category: 'sport',
        completed: false,
        stars: 3
      },
      { id: 14, time: '17:00-17:30', activity: '回家休息', description: '喝水、换衣服、吃点水果\n休息一下恢复体力', category: 'break', completed: false },
      {
        id: 15,
        time: '17:30-18:00',
        activity: '🏃 户外运动（30分钟）',
        description: '【每日必做，选做一项】\n1. 跳绳100个（分组完成）\n2. 摸高跳20次\n3. 户外跑步或骑车\n4. 拍球、踢球等球类运动\n目标：运动到微微出汗',
        category: 'sport',
        completed: false,
        stars: 2
      },
      {
        id: 16,
        time: '18:00-18:30',
        activity: '🧹 家务劳动（10-20分钟）',
        description: '【每日必做，选做一项】\n1. 整理自己的书包和文具\n2. 叠自己的衣服\n3. 帮忙摆碗筷、收拾餐桌\n4. 整理玩具和房间\n5. 给植物浇水',
        category: 'housework',
        completed: false,
        stars: 2
      },
      { id: 17, time: '18:30-19:00', activity: '晚餐时间', description: '和家人一起吃饭聊天\n分享今天的收获和快乐', category: 'daily', completed: false },
      {
        id: 18,
        time: '19:00-19:30',
        activity: '📚 复习巩固（20-30分钟）',
        description: `【第${dayNumber}天复习】\n1. 复习今天学的生字（读写）\n2. 复习数学口算（10题）\n3. 复习英语单词\n4. 背诵一首古诗或儿歌`,
        category: 'reading',
        completed: false,
        stars: 2
      },
      { id: 19, time: '19:30-20:00', activity: '自由活动', description: '看动画片、玩游戏\n可以看教育类动画片', category: 'break', completed: false },
      { id: 20, time: '20:00-20:30', activity: '洗漱时间', description: '洗澡、刷牙、准备睡觉\n学习独立洗漱', category: 'daily', completed: false },
      {
        id: 21,
        time: '20:30-21:00',
        activity: '🌙 睡前阅读',
        description: '【每日必做】\n1. 听爸爸妈妈讲故事\n2. 或自己看绘本\n3. 学习复述故事\n4. 培养良好的阅读习惯',
        category: 'reading',
        completed: false,
        stars: 1
      },
      { id: 22, time: '21:00', activity: '💤 准时睡觉', description: '晚安，做个好梦\n保证充足睡眠，明天更有精神', category: 'daily', completed: false }
    ]
  }

  // 初始化28天的计划（从1月26日开始）
  const initMonthSchedule = () => {
    const startDate = new Date(2026, 0, 26) // 2026年1月26日
    const scheduleVersion = '2026-01-26' // 版本号，基于开始日期

    monthSchedule.value = []

    for (let i = 0; i < 28; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)

      const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const dayName = dayNames[currentDate.getDay()]

      monthSchedule.value.push({
        day: i + 1,
        dayName,
        date: `${currentDate.getMonth() + 1}月${currentDate.getDate()}日`,
        fullDate: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
        tasks: generateDayTasks(i + 1)
      })
    }

    // 检查版本，如果版本不匹配则不加载旧数据
    const savedVersion = localStorage.getItem('scheduleVersion')
    if (savedVersion === scheduleVersion) {
      loadFromLocalStorage()
    } else {
      // 版本不匹配，清除旧数据并保存新版本
      console.log('检测到计划版本更新，重置数据')
      localStorage.setItem('scheduleVersion', scheduleVersion)
      saveToLocalStorage()
    }
  }

  // 切换任务完成状态
  const toggleTask = (dayIndex, taskId) => {
    const day = monthSchedule.value[dayIndex]
    const task = day.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      if (task.completed && task.stars) {
        totalStars.value += task.stars
      } else if (!task.completed && task.stars) {
        totalStars.value -= task.stars
      }
      saveToLocalStorage()
    }
  }

  // 更新任务
  const updateTask = (dayIndex, taskId, updates) => {
    const day = monthSchedule.value[dayIndex]
    const task = day.tasks.find(t => t.id === taskId)
    if (task) {
      Object.assign(task, updates)
      saveToLocalStorage()
    }
  }

  // 添加新任务
  const addTask = (dayIndex, task) => {
    const day = monthSchedule.value[dayIndex]
    const newId = Math.max(...day.tasks.map(t => t.id), 0) + 1
    day.tasks.push({
      id: newId,
      ...task,
      completed: false
    })
    saveToLocalStorage()
  }

  // 删除任务
  const deleteTask = (dayIndex, taskId) => {
    const day = monthSchedule.value[dayIndex]
    const taskIndex = day.tasks.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      const task = day.tasks[taskIndex]
      if (task.completed && task.stars) {
        totalStars.value -= task.stars
      }
      day.tasks.splice(taskIndex, 1)
      saveToLocalStorage()
    }
  }

  // 兑换礼品
  const redeemGift = (giftId) => {
    const gift = gifts.value.find(g => g.id === giftId)
    if (gift && totalStars.value >= gift.stars) {
      totalStars.value -= gift.stars
      gift.redeemed += 1
      saveToLocalStorage()
      return true
    }
    return false
  }

  // 添加礼品
  const addGift = (giftData) => {
    const newId = Math.max(...gifts.value.map(g => g.id), 0) + 1
    gifts.value.push({
      id: newId,
      ...giftData,
      redeemed: 0
    })
    saveToLocalStorage()
    return newId
  }

  // 更新礼品
  const updateGift = (giftId, updates) => {
    const gift = gifts.value.find(g => g.id === giftId)
    if (gift) {
      Object.assign(gift, updates)
      saveToLocalStorage()
      return true
    }
    return false
  }

  // 删除礼品
  const deleteGift = (giftId) => {
    const giftIndex = gifts.value.findIndex(g => g.id === giftId)
    if (giftIndex !== -1) {
      gifts.value.splice(giftIndex, 1)
      saveToLocalStorage()
      return true
    }
    return false
  }

  // 获取当前天的完成进度
  const getCurrentDayProgress = computed(() => {
    const day = monthSchedule.value[currentDayIndex.value]
    if (!day) return 0
    const tasksWithStars = day.tasks.filter(t => t.stars)
    if (tasksWithStars.length === 0) return 0
    const completedTasks = tasksWithStars.filter(t => t.completed)
    return Math.round((completedTasks.length / tasksWithStars.length) * 100)
  })

  // 获取当前天获得的星星数
  const getCurrentDayStars = computed(() => {
    const day = monthSchedule.value[currentDayIndex.value]
    if (!day) return 0
    return day.tasks
      .filter(t => t.completed && t.stars)
      .reduce((sum, t) => sum + t.stars, 0)
  })

  // 获取本月总星星数
  const getMonthStars = computed(() => {
    return monthSchedule.value.reduce((total, day) => {
      return total + day.tasks
        .filter(t => t.completed && t.stars)
        .reduce((sum, t) => sum + t.stars, 0)
    }, 0)
  })

  // 保存到本地存储
  const saveToLocalStorage = () => {
    localStorage.setItem('monthSchedule', JSON.stringify(monthSchedule.value))
    localStorage.setItem('totalStars', totalStars.value.toString())
    localStorage.setItem('gifts', JSON.stringify(gifts.value))
  }

  // 从本地存储加载
  const loadFromLocalStorage = () => {
    const savedSchedule = localStorage.getItem('monthSchedule')
    const savedStars = localStorage.getItem('totalStars')
    const savedGifts = localStorage.getItem('gifts')

    if (savedSchedule) {
      monthSchedule.value = JSON.parse(savedSchedule)
    }
    if (savedStars) {
      totalStars.value = parseInt(savedStars)
    }
    if (savedGifts) {
      gifts.value = JSON.parse(savedGifts)
    }
  }

  // 重置本月计划
  const resetMonth = () => {
    initMonthSchedule()
    saveToLocalStorage()
  }

  return {
    monthSchedule,
    currentDayIndex,
    totalStars,
    gifts,
    initMonthSchedule,
    toggleTask,
    updateTask,
    addTask,
    deleteTask,
    redeemGift,
    addGift,
    updateGift,
    deleteGift,
    getCurrentDayProgress,
    getCurrentDayStars,
    getMonthStars,
    resetMonth
  }
})
