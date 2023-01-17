# 区块链培训作业

请大家 fork 本仓库后答题，做完后提交自己的软件仓库链接。

## 第 1 题：Solidity 语言有哪些数据类型？

例如：

-   bool
-   int8

评分标准：每个数据类型计 1 分  
参考资料： https://docs.soliditylang.org/en/latest/types.html

答案：
-   值类型：bool、int、address、bytes、enum、function
-   引用类型：string、array、structs、mapping、bytes

## 第 2 题：列举并测试以太坊的 JSONRPC API。

评分标准：每条有效的（提供文本命令和测试截图） API 计 2 分，例如：

---

第 1 个 API： net_version

```shell
curl -s -X POST -H "Content-Type: application/json" https://matic-mumbai.chainstacklabs.com \
-d '{"id":1,"jsonrpc":"2.0","method":"net_version","params":[]}' | jq
```

![1673317288973](https://user-images.githubusercontent.com/7695325/211447294-e9e142c1-0fec-4588-9c8a-7ebfbd38a907.png)

---
答案：
-   第1个API：eth_mining
```shell
curl --location --request POST 'https://matic-mumbai.chainstacklabs.com/' \
--header 'content-type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"eth_mining","params":[],"id":71}'
```

![img_v2_15350480-e3c1-43b3-a81f-06606246920g](https://user-images.githubusercontent.com/40379005/212619781-43bfff69-0483-4d3c-aa68-77e45a66b507.jpg)


-   第2个API：net_peerCount
```shell
curl --location --request POST 'https://matic-mumbai.chainstacklabs.com/' \
--header 'content-type: application/json' \
--data-raw ' {"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}'
```

![img_v2_05e3b336-9d5e-4a3e-b24c-7ff91fab2fbg](https://user-images.githubusercontent.com/40379005/212618374-e81f88fd-4996-4441-832b-eb402373c0b3.jpg)



## 第 3 题：同一个合约里代码相同的函数，为什么 GAS 费不同？

请用 Remix 验证在同一个合约里，名称不同、代码相同的函数的 GAS 费不相等，并解释原因。

评分标准：

-   验证成功： 10 分，对过程要截图
-   解释正确： 10 分


答案
任何链上操作都需要根据它消耗的计算资源量来定价。在以太坊网络中，Gas是用于衡量用于执行每个特定操作的计算工作量的单位，并直接影响交易成本。由于每个协议采取不同的方法并且需要执行不同的函数来进行交换，因此每个交易的消耗也不同。

一笔交易可以调用任意数量的函数并与许多不同的智能合约进行交互。下面，我们可以看到使用Tenderly提供的工具进行的两笔不同交易的Gas消耗明细。如您所见，第二笔交易最终比第一笔交易多花费了70%的Gas。

![image](https://user-images.githubusercontent.com/40379005/212820024-adde771c-23db-47c6-a324-9aeabba6ff6a.png)


## 第 4 题：用 Remix 部署校验合约

用 Remix 写一个合约，部署到 mumbai 链上，计算 mumbai 链的最近平均出块时间，并校验合约代码代码。

评分标准：

-   代码正确：截图 10 分
-   部署成功：截图 10 分
-   代码校验：截图 5 分
-   获取结果：截图 5 分

## 第 5 题：黑名单 ERC20 合约

### 5.1 修复 BlacklistTokenFactory 合约里的 bug

命令 `yarn deploy:mumbai` 会在 mumbai 链上部署 BlacklistTokenFactory 和一个 BlacklistToken 合约（简称 BT1 ），地址保存在 deploy/deployed/mumbai.json 文件里（提示：删除该文件可以重新部署）。请在区块链浏览器上调用 BlacklistTokenFactory 合约里的 createBlacklistToken 函数，动态创建一个 BlacklistToken 合约（简称 BT2 ）， BT2 的地址保存在 BlacklistTokenFactory 的 blacklistTokens 数组里，也可以在交易里的 CreateBlacklistToken 事件里查看 BT2 的地址。因为目前 BlacklistTokenFactory 合约里有 bug，导致 `yarn test` 报告某些测试用例失败。请在区块链浏览器上比较 BT1 和 BT2 的功能，找出 BT2 功能异常的问题现象。并尝试修复合约 contracts/BlacklistTokenFactory.sol 的代码，能通过文件 test/BlacklistTokenFactory.test.js 里全部的自动化测试。

评分标准：

-   找到问题现象： 截图 10 分
-   解释问题原因： 10 分
-   修改合约代码： 20 分
-   自动化测试全部通过： 10 分

### 5.2 优化 BlacklistTokenFactory.test.js

参考： https://hardhat.org/tutorial/testing-contracts , 使用 loadFixture 重构 test/BlacklistTokenFactory.test.js 文件。

评分标准： 30 分

### 5.3 增强 BlacklistToken 合约的功能

修改本代码仓库里的 BlacklistToken 合约代码，在转账的时候抽取 10% 的手续费，并把被扣除的手续费转给合约的创建者。

评分标准：

-   代码正确： 30 分
-   部署成功： 10 分
-   代码校验： 10 分
-   手工测试： 10 分
-   
### 5.4 对 BlacklistToken 合约进行自动化测试

目前 BlacklistToken 还没有写测试用例，请在 test/BlacklistToken.test.js 文件里尽量补齐。可参考 https://hardhat.org/tutorial/testing-contracts 和网上其它开源项目的测试用例。

评分标准：每个有效的（能执行通过）测试用例 10 分，性质相同的用例不重复计分
