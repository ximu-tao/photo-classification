# 部分软件设计说明文档

# 存储数据格式

> 存储数据格式, 指 config.json 中的用户配置数据的格式

### data-v1 版本

略

### data-v2 版本

```json
[
  {
    "configName": "config1",
    "keymap": {
      "0": "D:\\",
      "1": "C:\\",
//      ...
      "y": "",
      "z": ""
    }
  },
  {
    "configName": "config2",
    "keymap": {
      "0": "D:\\",
      "1": "",
//      ...
      "y": "",
      "z": ""
    }
  }
//      ...
]
```

### data-v3 版本

```json
{
  "keymapList" : [
    {
      "configName": "config1",
      "keymap": {
        "0": "D:\\",
        "1": "C:\\",
        //      ...
        "y": "",
        "z": ""
      }
    },
    //      ...
  ]
}
```
