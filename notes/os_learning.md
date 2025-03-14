# General
- 总线分为数据、地址、控制三条
- 地址总线的数量会限制其能够访问的内存。如32条总线只能操作4G内存，因为4G的内存一共有2^32的地址

- cpu运行逻辑
    - 访问pc，准备代码和数据->解析内容并运行->pc自增，再准备新数据
- 指令的类型
    - 运算、传输数据、跳转、信号（例如中断）、闲置（nop）

# 缓存
- SRAM：用于缓存，断电就没
- DRAM：用于内存和显存，因为用了电容所以要定期刷新，但断电还是没
- L1：为core-exclusive，但分为指令和数据缓存两种
- L2：为core-exclusive，不分指令和数据
- L3：多核共享
- 缓存块（cache line/block）
    - 组标记（标记同索引下时这是哪个块，因为多个内存块可以映射到一个索引），索引（指向内存块），偏移量
- 内存：没啥好说的，最多就是虚拟内存管理和与硬盘swap而已（这也是每个硬盘可以设置虚拟内存空间的原因）
- 多核缓存同步
    - 两个重点：
        - 写传播：把变化传播到别的核心
        - 事务串行化：队列或者锁就是干这个的，让变化的顺序可以预测
    - solutions
        - 总线嗅探（bus snooping），但非常低效
        - MESI
            - 重要概念：自己和别人的read和write
            - M：modified
                - 采用写回（有需要时才写回内存）
                - 如果被外部read了就写回和S
                - 如果被外部write了就写回和I
            - E：exclusive
                - 只有自己read了这个数据就会E
                - 如果自己write了就M
                - 如果别人read就S
                - 如果别人write了就I
            - S：shared
                - 多核共用数据时S
                - 自己write了就M，其他S变成I
                - 别人write了就自己变成I
            - I：Invalid
                - 无数据或者无效数据
                - 独占read则E，多人read则S，有人M则读取内存和与那个人S
                - 独占write则缓存并M，有人则按上面的规则改变他们的状态（如M写回，S/E变I）
- 特殊内容：
    - 伪共享：
        - 同一line内不同数据被修改，哪怕这些数据不是同一位都会导致这line被不停写回，和没cache一样
        - solution：、
            - 对于需要频繁修改的数据：有些指令可以把指定数据对齐cache line而非排在同一line上
            - 对于不会频繁修改的数据：前置填充和后置填充，让数据所map到的cache line（可能多过一个）一定不会和其他东西共用line


# 内核
- 基本功能
    - 进程管理
        - 进程创建和终止：管理进程的创建、终止和清理。
        - 进程调度：决定哪个进程在什么时候运行，以实现多任务处理。
        - 进程同步和通信：提供进程间通信（IPC）机制，如信号、管道、消息队列、共享内存等。
    - 线程管理
        - 线程创建和终止：管理线程的创建、终止和清理。
        - 线程调度：决定哪个线程在什么时候运行，以实现多线程处理。
        - 线程同步和通信：提供线程间同步机制，如互斥锁、信号量、条件变量等。
    - 内存管理
        - 内存分配和回收：管理内存的分配和回收，包括物理内存和虚拟内存。
        - 内存保护：确保进程之间的内存隔离，防止一个进程访问另一个进程的内存。
        - 分页和分段：实现虚拟内存管理，通过分页和分段技术提高内存利用率。
    - 文件系统管理
        - 文件系统接口：提供文件系统接口，支持文件的创建、删除、读写等操作。
        - 文件系统类型：支持多种文件系统类型，如 ext4、NTFS、FAT32 等。
        - 文件权限和安全：管理文件权限和安全，确保文件的访问控制。
    - 系统调用接口
        - 系统调用：提供系统调用接口，供用户态程序调用内核功能。
        - API 暴露：暴露一些系统 API 给应用程序，支持应用程序与内核的交互。
    - 中断和异常处理
        - 中断处理：管理硬件中断，提供中断处理机制。
        - 异常处理：处理异常情况，如非法指令、内存访问错误等。
    - 安全和权限管理
        - 用户和组管理：管理用户和组，提供用户认证和权限控制。
        - 访问控制：实现访问控制机制，确保系统资源的安全。
    - 网络管理
        - 网络协议栈：实现网络协议栈，支持 TCP/IP、UDP 等网络协议。
        - 网络接口：提供网络接口，支持网络设备的管理和数据传输。
    - 设备管理
        - 设备驱动：管理硬件设备的驱动程序，提供设备的读写接口。
        - 设备接口：提供统一的设备接口，支持字符设备、块设备和网络设备等。
    - 电源管理
        - 电源管理：管理系统的电源状态，支持休眠、唤醒等功能。
        - 节能策略：实现节能策略，优化系统的电源消耗。
    - 时间管理
        - 时钟管理：管理系统时钟，提供时间和定时器功能。
        - 定时器：支持定时器中断，提供定时任务调度。
- 一些概念
    - Dispatcher 调度器，切换进程线程上下文的
    - Scheduler 调度器，multitask下决定什么任务下一个运行的(也就是负责什么ddl、rt、cfs的)
    - IPC Inter-Process Communication，用来在进程间和线程间通信的
    - VFS 虚拟文件系统，其实就是文件系统管理的一部分，提供统一文件接口让不同文件系统可以在于一个os中共存
    - server
        - 各种网络功能，比如文件传输、文件打印、数据库/web服务等
- 应用程序运行时，根据其使用的功能和内存分两个"态"
    - 用户态
        - 应用程序不使用系统调用时的态
        - 使用用户空间
            - 只能访问部分内存
    - 内核态
        - 当使用系统调用就会进入，会打断用户态直到内核程序运行结束
        - 使用内核空间
            - 内核空间能够访问所有内存
- Linux 内核设计理念
    - MultiTask 多任务
        - 并发 Concurrency：单核时间轮
        - 并行 Parallelism：多核
    - SMP 对称多处理
        - 每个CPU核的权限和资源是相等的，没有地位高低，每个CPU都能访问所有资源
    - ELF 可执行文件链接格式
        - 文件被分为多个分段，每个分段都有其作用
            - ELF 头（ELF Header）：描述文件的基本属性，如文件类型、架构、入口点地址等。
            - 程序头表（Program Header Table）
                - 描述所需段的meta data和运行配置啥的，比如a段要怎么执行，b段要怎么执行，地址、大小啥的
            - 节头表（Section Header Table）：
                - 描述所需段的meta data啥的，比如节的地址、名称、大小、类型等。
            - 段（Segment）：程序运行时需要加载到内存中的部分。
                - 可执行代码段（.text）：存储程序的可执行代码。
                - 初始化数据段（.data）：存储程序的已初始化的全局变量和静态变量。
                - 未初始化数据段（.bss）：存储程序的未初始化的全局变量和静态变量。
                - 只读数据段（.rodata）：存储程序的只读数据，如字符串常量。
                - 动态链接信息段（.dynamic）：存储动态链接器所需的信息，如动态库的名称、符号表等。
                - 动态符号表段（.dynsym）：存储动态链接器所需的符号表。
                - 动态字符串表段（.dynstr）：存储动态链接器所需的字符串表。
            - 节（Section）：编译和链接过程中使用的部分。
    - Monolithic 宏内核
        - 用一个巨大的可执行文件实现所有内核功能
- Microlithic 微内核
    - 把IPC、VM、调度器等底层逻辑之外的东西解耦到用户态的内核
    - 但底层逻辑常被访问，因此，态会频繁被切换，带来性能损耗
- hybrid 混合内核，在微内核的基础上实现某些功能并包裹在一个大程序中成为新的内核，有点像宏内核包着微内核


# 调度器
- 进程和线程都以task_struct结构体表示
- 调度算法
    - 抢占式调度算法
        - 调度触发时机：时间片耗尽
    - 非抢占式调度算法
        - 调度触发时机：大部分进程状态切换时都会，具体而言就是 就绪->运行->阻塞or结束 会触发调度
- 调度原则
    - CPU利用率：比如IO等待时应该挂起
    - 系统吞吐量：比如过长的单一进程运行时间会导致单位吞吐量减少
    - 周转时间：包括等待时间（就绪等待时间、IO等待时间）和运行时间
    - 响应时间：用户交互性强的任务应该尽快被调度响应，比如鼠标键盘
- 调度算法
    - First Come First Serve FCFS 先来先服务
        - 单核CPU常见
        - 优点：
            - 适合CPU繁忙任务，有利于长任务
        - 缺点：
            - 长任务会阻塞CPU，使其他任务的等待时间变长
            - 不适用于IO繁忙的系统
    - Shortest Job First (SJF) 最短任务优先
        - 优点：
            - 能提高吞吐量
        - 缺点：
            - 长任务的等待时间会变长
    - Highest Response Ratio Next (HRRN) 高响应比优先
        - 优先权计算公式：(等待时间 + 要求运行时间) / 要求运行时间
            - 等待时间和优先级成正比
            - 要求运行时间会影响正比的斜率
    - Round Robin (RR) 时间片轮转
        - 基于时间片 (Quantum)
        - 单个时间片的长度不可太长或太短，20-50ms比较折中
        - 优点：比较直白就不写了
        - 缺点：
            - 没有优先级之分
    <bruh id="|" />
    - Highest Priority First (HPF) 最高优先级
    - Multilevel Feedback Queue 多级反馈队列
 
- 有三种 调度类 | 调度器 | 调度策略 | 运行队列（Run Queue）
    - Deadline | Deadline调度器 | SCHED_DEADLINE | dl_rq
        - 以ddl近为优先
    - Realtime | RT调度器 | SCHED_FIFO/_RR | rt_rq
        - _FIFO：以任务为最小单位的优先队列(也就是完成了任务才换下一个)，有优先度的设定可以插队
        - _RR：以时间片为最小单位的优先队列，有优先度设定可以插队
    - Fair | CFS 调度器 | SCHED_NORMAL/_BATCH | cfs_rq
        - 都是完全公平调度CFS（Completely Fair Schedule）
            - 以一个动态的量vruntime为标准分配任务，vruntime越少就越先跑
                - 任务每次运行都会更新其vruntime: vruntime += delta_exec* NICE_0_LOAD/权重
                    - delta_exec：实际运行时间
                    - 每个任务都有自己的权重，权重愈高，新的vruntime就加的越少，就越有机会被调度
                    - NICE_0_LOAD差不多是个常量，但是是用来标识优先级的
                    - 所以vruntime就是实际运行时间经由权重和NICE值映射后的虚拟运行时间，越短，在电脑的角度来看就就代表越少被运行，就会更容易被调度
        - _NORMAL：用于前台普通任务
        - _BATCH：用于后台普通任务
- 运行队列顺序：dl_rq > rt_rq > cfs_rq
- dl和rt用于实时任务，cfs用于普通任务
- 优先级分配
    - 0-139个优先级
        - 0-99是实时任务的
        - 100-139是普通任务的
    - 优先级越小越高
    - nice值为-20-19这个区间，也就是普通任务从中间往左右走的优先级
    - linux可以用`nice -n -[nice值] [task]`和`renice -[nice值] -p [进程pid]`来设置task的优先级
- 调度策略分配：linux可以用`chrt -[调度策略] [优先级] -p [pid]`来改变调度策略
- 中断
    - 硬中断->软中断
    - 流程：
        - 对于一个需要中断的任务，例如回调任务，会先硬件中断让cpu该任务必须先完成的部分完成（例如超时了就会消失的时间敏感数据）
        - 等cpu搞定了目前的事儿，就回过头来软中断，把任务以线程的方式塞给cpu
    - 具体一个任务怎么划分硬中断和软中断则由os自己hardcode决定
        - eg 网卡有数据，硬中断会叫cpu把网卡数据先存入内存，软中断则会让cpu开始拆包解析网卡的数据
    - 指令
        - `/proc/interrupts`可以得到硬中断情况
        - `/proc/softirqs`可以得到cpu核的各类总中断次数
        - 而软中断的线程则可以通过ps找到
            - `ps aux | grep softirq`：这个指令会得到一堆有`[ksoftirqd/0]`标识的线程，代表kernel soft interrupt，斜杠后的数字是cpu core的索引


# 进程线程（只要没指名，都是在说linux内核的规则）
## 进程
- 所谓用户，就是一个进程。也就是说进入内核态进入用户态的就是进程
- 内存
    - 每个进程都有独立的虚拟内存(内核+用户空间)（这就是虚拟内存的设计理念的体现）
    - 具体多大看os定义
    - 每个进程的虚拟内存中的内核空间映射的是同一块物理内存
- 每个进程有七种状态
    - 创建状态 new
        - 进程创建中的状态（和就绪状态有什么区别？A：因为需要检查和分配资源）
        - 尝试申请空白PCB并分配资源
            - 申请失败就创建失败，分配失败则进入创建状态的子状态*等待分配资源状态*
        - 最后插入队列，创建结束，进入就绪状态
    - 就绪状态 ready
        - 在就绪状态被调度就会进入运行状态
    - 运行状态 running
        - 在时间片中运行其任务
        - 运行出错就进入结束状态
        - 运行结束(时间片用完了)则重回就绪状态
        - 运行时出现了必须等待的操作，比如回调或者IO就会进入阻塞状态
        - 运行状态只要离开了，CPU就会立刻换下一个进程来运行
    - 阻塞状态 blocked
        - 找到要被阻塞的PCB，保护现场(保存各种CPU状态)、插入阻塞队列，进入阻塞状态
        - 进程一旦被阻塞，只能由另一个进程唤醒，被阻塞的进程不能自唤醒
        - 当阻塞进程等待的事件出现且被发现，发现者进程就会从阻塞队列找到并移除该阻塞进程，然后插入到就绪队列
    - 结束状态 terminated
        - 进程不再有用，可以被释放了
        - 终结其子进程(如有且os选择这么做)、回收资源
        - 从队列中移除
    - 就绪挂起状态 ready suspended
        - 进程就绪，但物理内存不足，所以swap到硬盘挂着，等内存有空余能分配给这个进程用再回来
        - 只要物理内存有空间就会立刻被交换回来，并进入就绪状态
        - 被挂起的进程无法被调度，必须等到物理内存有空间。
    - 阻塞挂起状态 blocked suspended
        - 进程阻塞等待中，但物理内存不足，所以swap到硬盘挂着，等内存有空余能分配给这个进程用再回来
        - 只要物理内存有空间就会立刻被交换回来，但仍然是阻塞状态
        - 被挂起的进程无法被调度，必须等到物理内存有空间。
        - 如果在阻塞挂起时事件结束（也就是说物理空间仍然不足，无法脱离挂起），则继续阻塞挂起直到swap回去后变为阻塞状态，然后因为检测到事件结束变为就绪状态
- 挂起和换回一个进程的准则：
    - 手动设置不在此限
    - 优先级、状态(就绪和阻塞)、占用内存情况、阻塞频率、实际被调度的时长都会决定挂起和换回哪个进程
    - 一般只要物理内存有空间就会立刻被交换回来
- 手动设置进程挂起：比如用sleep可以使进程挂起，ctrl+z在linux中也可以挂起进程
- 进程控制块 Process Control Block (PCB)
    - 用来描述进程的一块数据
    - 一般维护在内核空间。注意进程本身是在**用户空间**的，进程控制块才是在内核空间的
    - 大致包含以下几种信息：
        - 进程描述信息
            - 进程标识符 PID：标识进程用的id
            - 用户标识符：标识用户用的id
        - 进程控制与管理信息
            - 进程状态
            - 进程优先级
        - 资源分配清单
            - 内存地址空间信息（用户空间、内核空间）、打开的文件列表和使用的IO设备信息
        - CPU信息/CPU上下文
            - 进程运行时需要的cpu状态，如寄存器内的值、PC的值等，以便从断点继续
    - 进程表
        - 储存PCB的一个容器
        - 用链表实现优先级队列
            - 因此可能会有插入时优先级对比的复杂度问题。多级队列能减缓
        - 分为就绪队列和阻塞队列。也有使用连续索引(数组)的，但比较少
        - 由进程管理系统维护
    - PCB有限，一般受限于os的资源量，也可以手动调配数量
- 进程上下文切换
    - 基本上进程肯定得进入内核空间切换，因为进程的正确运行需要无数系统功能，例如内存管理系统。PCB本身也储存在内核空间
    - 基本上就是加载寄存器内的值、PC的值等
- 初始进程 `init`
    - PID为1的元祖进程，由内核创建的第一个进程，用于初始化系统各种功能任务，例如启动系统服务
    - 父进程被终结的子进程会被assign到1号进程下，已防止孤儿进程出现
- 子进程与父进程
    - 子进程可以继承资源，被终结时会归还资源
    - 父进程被终结时，子进程一般也会被终结，但做法不绝对，比如linux就不会这么做
- 互斥机制
    - 信号量
## 线程
- 单个进程的任务或许能分成多个sub-tasks，每个sub-task都花很长的时间，但*并发*能提升速度。用多进程来解决这个问题又出现了进程通信、开销优化(分配和释放资源)的问题。因此就出现了能够共享资源和并发运行的线程
- 线程的资源大部分共享进程资源，比如全局变量、虚拟内存啥的
- 线程的优缺点
    - 优点：
        - 并发
        - 共享资源（内存空间），因此不用像进程一样刚需内核功能来传递数据（不需要IPC）
        - 创建和终止快，因为它们基本上就是复制进程的数据过来，不需要重新获取资源管理信息（重新调用各种内核功能）
        - 内存访问快，因为它们都在同一个进程的页表内，更容易hit
    - 缺点：
        - 一个线程崩溃就会使整个进程崩溃，也就是所有其中的线程都会崩溃
- 线程控制块 Thread Control Block：
    - 和PCB类似，用来保存识别和运行所需的资源
    - 内有线程ID，寄存器上下文、PC、堆栈指针(内存)啥的，以确保逻辑控制相对独立
    - 注意线程本身是在进程内的，所有线程本身也是在**用户空间**的，只是TCB视乎os的实现不一定在用户空间而已
- 线程切换
    - 基本上只需要切换堆栈、寄存器值就行了，内存共享进程，不需要换
    - 如果不是同一个进程里的，逻辑和资源消耗就和切换进程一样
- 线程的实现有三种
    - 用户线程
        - 完全通过program模拟实现线程功能，包括时间片、调度器、生命周期啥的，因此用户线程完全不关心进程的功能，只会被进程当成普通program该咋跑咋跑
        - TCB保存在用户空间，对线程的操作，如切换堆栈、PC和寄存器等都在用户空间，不需要任何内核态功能，速度非常快
        - 不支持内核线程的os也能用用户线程
        - 缺点：
            - 一个用户线程的任务阻塞了，所有同一进程内的用户线程都会一起进入阻塞状态，线程间无法打断，只能主动让出（因为打断是内核功能，但TCB不在内核）
            - 无法利用并行功能
            - 由于内核并不知道用户线程的存在，分时间片不会考虑用户线程，而是只考虑PCB，因此同一进程中的用户线程就只能瓜分进程分到的那一点时间片，相比内核线程短不少，执行比较慢
        - 有趣的是，常见的用户线程库有POSIX，之前也见到过
    - 内核线程
        - 内核管理的线程，TCB储存在内核空间中
        - 每个线程会得到更长/多的时间片，因为内核调度注意到多线程了
        - 一个线程阻塞不会阻塞其他线程
        - 缺点：
            - 系统开销更大了，因为线程的资源切换由内核处理
    - 轻量级进程 (Light-weight Process)
        - 让用户线程和内核线程共存的一种中间件。
        - 用户线程通过LWP就能与内核线程交流，间接获得内核支持的各种功能例如并行，最终达到双方取长补短的效果。
        - 一个进程内可以有多个LWP
        - 每个LWP对于一个内核线程，但LWP对应不止一个线程
        - LWP对用户线程的支持有三种模式
            - 1 : 1
                - 一个用户线程对一个LWP，解决了用户线程无法并行和互相阻塞的问题，但内核线程的缺点仍然存在--线程操作开销仍然大
            - N : 1
                - 多个用户线程对一个LWP，解决了线程操作开销大的问题，但用户线程仍然无法并行和会互相阻塞
            - M : N
                - 多个用户线程对多个LWP，平均上述两者，partially解决所有问题和获得所有优点



# 内存
### 一些概念
- 对于物理内存来说，内核和用户空间映射的物理地址并没有什么区别
- 每个进程都有自己独立的虚拟地址空间，且互相之间没有半点关系，物理内存分配交由os其他部分决定。只不过每个进程的内核空间在物理地址指向的都是同一片地址罢了
- 所以内核也可以被视为一种特殊的程序，一种在os运行中不会离开内存的程序
### 段式
- 把内存按照功能分为一段一段的区块，然后每个内存访问都按照其对应哪个功能来导向区块/这些区块就被称为"段"
- 每个段都有自己的
    - 段号：段的编号
    - 段基址：段的起始地址，例如0x00000000
    - 段长度：段的长度
- 段表：系统会维护一个段号映射段基址的段表
- 分为逻辑地址和物理地址
    - 逻辑地址：段号 + 段内偏移量
    - 物理地址：段基址 + 段内偏移量
- 流程
    - 程序访问的都是逻辑地址
    - 通过段表获得段基址
    - 物理地址就用查到的段基址和剩余的段内偏移量来获得
### 页式
- 没啥好说的，最多提一嘴虚拟地址、多级页表、TLB
### linux/intel cpu 内存管理
- cpu大多是intel的，而intel一开始用段，后来加了层页，所以原本用页的linux也不得不加层段了
- 线性地址
    - 段页式体制下的段物理地址/页虚拟地址
- 流程
    - 逻辑地址->段内存输出线性地址->页将线性地址当成虚拟地址，输出最终物理地址
- 有趣的是，linux把段表的所有内容都映射为了0x0，也就是屏蔽了段的作用
- 内核内存空间，用户内存空间
    - linux把虚拟内存分为了内核空间和用户空间
        - 32位下：0x0起3G为用户，随后1G为内核，填满2^32=4G
        - 64为下：0x0起128T为用户，随后空出一片未定义空间，直到剩下128T给内核空间，填满2^64=8EiB
        - 因为内核空间的内容是固定的，所有进程指向内核空间的虚拟内存地址其实都映射到相同的物理内存
        - 注意，虚拟内存的大小和物理内存一般没关系
    - 用户空间内容（由0x0起）
        - 程序文件 .text
        - 已初始化数据 .data
            - 在程序启动那一刻就已经被赋予初始值的全局变量和静态变量
        - 未初始化的数据 .bass
            - 在程序启动那一刻未被赋予初始值的全局变量和静态变量。它们会被自动初始化为0
        - 堆
            - 需要动态分配内存的对象和数据结构
            - 在C中是malloc、free，在js/java中就是new和GC机制
            - eg：动态分配的数组，链表、树
        - 文件映射 Memory-Mapped Files
            - 一种把文件内容加载到内存以访问的技术。通过把文件内容加载到内存，然后把访问文件的虚拟地址映射到内存的地址上，就可以避免消耗资源的IO操作
            - 也可以以进程共享映射实现进程通信(IPC)
            - 事实上我没太搞懂，但放到明天再看吧，时间不多了
        - 栈
            - 就是栈
- 解释型语言和编译型语言的内存管理有所不同
    - 解释型的依赖堆和栈


# 浮点数
- 浮点数采用了一种用逻辑运算替代数字本身复杂度的方式来储存一个小数
- 分为三个部分
    - 符号位
        - 标识这个数字的正负
    - 指数位
        - 用来标识二进制下，尾数的小数点要向左或者右移动多少位才能获得实际的数字
        - 由于储存空间的珍贵，我们不会把指数位的符号记录下来，而是储存一个补偿值，用多了一步的逻辑运算“偷”多一位数
            - 如果指数位有n位，补偿值就是2^(n-1)，储存的值就是 原指数+2^(n-1)
            - 在取出的时候减去这个补偿值就能得到原指数
            - 如果指数位是2^(n-1)，意味着原指数是0，也就是说这个数是1.xxxx，也就是大于1
            - 如果指数位是2^(n-1)-1，意味着原指数是-1，也就是说这个数是0.1xxx，也就是小于1
    - 尾数位
        - 其实就是稍微变化了的有效数字位
        - 二进制科学计数法时，小数点后的数
            - 注意，科学计数法天生有一个指数位（原指数是0意味着这个数大于1，因为默认有一位1在小数点前）
            - 因为小数本身用二进制表达的话，第一位一定是1（交给指数位来判断要不要前补0），所以直接储存小数点后的数就行
            - 这样储存也能很直观地展示这个数的精度：log10(2^(尾数位数+1))
- 精度不是固定的，具体要看表达的位数(如2.x比1.x低一位精度)，尤其是对于很大或者很小的数
    - 精度最佳的数值范围，十进制是-1和1之间，一旦大于等于1或者小于等于-1都会导致要用用2^0来表达这个数，也就是有一位尾数会用来表达二进制中小数点前的1。
- float 是32位，1+8+23，十进制最大精度是log10(2^24)≈7.22
- double 是64位，1+11+52，十进制最大精度是log10(2^53)≈15.95
- 尾数位完不完美不是靠能否被2整除来判断，而是用能否x2^n成为整数来表达（或者说不停x2能否得到一个整数




# to-do
- 用户空间的文件映射和标准文件IO的异同 
- 根据教材里的红笔来接着学 （[here](#|)）