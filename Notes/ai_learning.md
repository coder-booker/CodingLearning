# AI 工具
- 模型：
    - sonnet4：平时的大部分任务
    - o3/o3-pro：复杂代码
    - Gemini-2.5pro/opus4/ds：备选
- code buddy
    - 可视化替换代码
    - 代码段级别的diff替换
    - 右键解释代码、生成注释
    - 自动更换模型，比如复杂问题用ds r1
    - agent模式：让ai有更多权限，比如文件生成、直接修改代码等
    - AI 审评CR，包括代码本身和commit（可以定制化）
- prompt 技巧
    - 提供模板

# 应用
- 思考
    - 一个产品接入一个对话Bot问答算不上一个新能力，同质化严重
    - 工具与AI的结合，AI无法完成人也难以完成的很多事
    - 应用大概的场景
        - AIGC（内容创作）
            - 主动（比如问答啥的
            - 被动（比如意图识别
        - 交互变革、智能助手
        - 百科全书
    - 工具
        - RAG
        - function call
        - 让AI生成代码运行
        - 思维链


# 产品
- AI私人助手
    - 形象
    - 声音（音色、顿挫、语速
    - 性格（性格滑块？记忆设定（也就是身份
    - 具体交互行为（语音、文字、主动被动、偏好数据、环境感知、生活集成


# 理论
- history
    - Back Propagation
    - 向量机、LSTM
    - 单层感知器、BP网络、传统隐马尔科夫模型（Traditional Hidden Markov Model）、条件随机场（Conditional Random Fields）、最大熵模型（Maximum Entropy Model）、集成学习（Ensemble learning）、支持向量机（Support vector machine）、核回归（Kernel regression）和仅含单隐层的多层感知器网络等；
    - bias可以视为一种微调方案
    - 深度学习
        - 2006年后的神经网络开始被称为深度学习
        - 以自动编码器实现了深度自编码器、稀疏自编码器等，利用自编码器构造了深度神经网络。
    - 卷积神经网络AlexNet
    - alpha go，强化学习：Q-Learning、策略梯度法、蒙特卡罗方法和时序差分学习等
    - transformer
    - 单词向量化、tokenizer（Byte-Pair Encoding(BPE)是最广泛采用的subword分词模型）


- Transformer架构
    - 针对文本的编码器（encoder）和解码器（decoder）的堆叠设计
    - 通过多头注意力机制（MHA）来计算文本序列中前后token的关联度，与传统的RNN架构的巨大区别（LSTM通过门机制来赋予不同时间所出现的token不同的重要性）。
    - 通过预训练（Pre-Train）+监督学习（Supervised Learning）标注
    - pre-train
        - 模型的预测精准度是决定于他所能看到的范围，所以在预训练时尽可能构造出“同一时间可以看见的最大范围的上下文”，那么在推理时就会更加的精准，这也是预训练（Pre-Train）需要超大规模集群的原因。
        - 从大量的无监督文本数据中学习语言
        - Supervised Fine Tuning有监督微调：该过程将会让模型学习如何解决特定领域的问题，OpenAI提出了指令微调（Instruct Finetuning）的方案来完成SFT过程。
        - Reinforcement Learning with Human Feedback
        - 通过SFT和RLHF算loss

- 单词向量化、tokenizer（Byte-Pair Encoding(BPE)是最广泛采用的subword分词模型）