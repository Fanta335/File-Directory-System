# File Directory System

コマンドライン入力を介して操作するアプリケーションです。  
現在使用できるパッケージは以下の通りです。
- **MTools**: 数学演算を行うパッケージ
- **CCTools**: さまざまな国の通貨を変換するパッケージ


# Usage
## MTools
MToolsは、シンプルな数学演算を行います。  
コマンド、引数（半角数字）を入力することで演算の結果を得ることができます。
```
$ MTools [command] [args]
```

### Command List
- add
- subtract
- multiply
- divide
- exp
- log
- abs
- sqrt
- round
- ceil
- floor

<details>
<summary>More command instructions</summary>
<div>

## add
コンマで区切った半角数字の引数を2つ入力してください。
  
e.g.
```
$ MTools add 3,4
MTools:
your result is: 7
```

## subtract
コンマで区切った半角数字の引数を2つ入力してください。
  
e.g.
```
$ MTools subtract 6,7
MTools:
your result is: -1
```

## multiply
コンマで区切った半角数字の引数を2つ入力してください。
  
e.g.
```
$ MTools multiply 6,7
MTools:
your result is: 42
```

## divide
コンマで区切った半角数字の引数を2つ入力してください。ただし、0で割ることはできません。
  
e.g.
```
$ MTools divide 6,3
MTools:
your result is: 2
```
## exp
コンマで区切った半角数字の引数を2つ入力してください。
  
e.g.
```
$ MTools exp 6,3
MTools:
your result is: 216
```
## log
コンマで区切った半角数字の引数を2つ入力してください。ただし、底は0以上かつ1以外の数である必要があります。
  
e.g.
```
$ MTools log 2,8
MTools:
your result is: 3
```
## abs
半角数字の引数を1つだけ入力してください。
  
e.g.
```
$ MTools abs -4
MTools:
your result is: 4
```
## sqrt
半角数字の引数を1つだけ入力してください。
  
e.g.
```
$ MTools sqrt -4
MTools:
your result is: 4
```
## ceil
半角数字の引数を1つだけ入力してください。
  
e.g.
```
$ MTools ceil -4
MTools:
your result is: 4
```
## round
半角数字の引数を1つだけ入力してください。
  
e.g.
```
$ MTools round -4
MTools:
your result is: 4
```
## floor
半角数字の引数を1つだけ入力してください。
  
e.g.
```
$ MTools floor -4
MTools:
your result is: 4
```

</div>
</details>
<br>

## CCTools
CCToolsは、さまざまな国の通貨を一定のレートに基づいて変換するパッケージです。  
```
$ CCTools [command] [optional arg]
```

### Command List
- showAvailableLocales
- showDenominations
- convert

<details>
<summary>More command instructions</summary>
<div>

## showAvailableLocales
引数は受け取らず、変換するための利用可能なロケールのリストを表示します。
  
e.g.
```
$ CCTools showAvailableLocales
CCTools:
India
USA
Europe
UAE
```

## showDenominations
利用可能なロケールのリストから1つの要素を引数として受け取り、そのロケールでサポートされているデノミテーション（通貨の単位）のリストを表示します。
```
$ CCTools showDenominations [locale]
```
e.g.
```
$ CCTools showDenominations India
CCTools:
Rupee
Paisa
```

## convert
変換前の通貨の単位、通貨量、変換先の通貨の単位の3つの引数を受け取り、通貨を変換し、入力と出力の値、通貨単位を表示します。通貨量は半角数字で入力してください。  
出力の通貨量は、小数第三位以下を切り捨てます。
```
$ CCTools convert [sourceDenomination] [sourceAmount] [destinationDenomination]
```
e.g.
```
$ CCTools convert Rupee 200 Dollar
CCTools:
Input: 200 Rupee, Output: 2.72 Dollar
```

</div>
</details>
<br>

# URL
https://file-directory-system.vercel.app/
