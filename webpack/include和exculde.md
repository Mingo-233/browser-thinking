
## include和exculde

webpack配置时，为了提高解析速度，需要指定需要处理的文件。有三种配置可以指定需要处理的文件：
	1. test
	2. include
	3. exclude

test

test: /\.jsx?$/

正则表达式，指定项目中所有的文件（包含node_modules）后缀名为.jsx 或者 .js的文件。include
指定需要处理的文件。可以是具体的文件或者文件名。当include可以指定所有的需要处理的文件时，不需要exclude的存在！！！


include: [        
          path.resolve(__dirname, './node_modules/normalize.css'),        
          path.resolve(__dirname, './node_modules/antd-mobile'),        
          path.resolve(__dirname, './node_modules/react-wx-images-viewer')      
      ]

也可以正则表达式



include: /\/node_module\/^antd.*/


意义：指定需要处理的文件是include对应的文件或者文件夹中符合test指定的类型的文件exclude
优先级最高
优先级高于test和include
当include和exclude同时存在时，以exclude的为主。
两者同时存在且有效的情况是，exclude是include的子集，指定除normalize.css之外的所有/node_moduels/


exclude: [      
  path.resolve(__dirname, './node_modules/normalize.css'),   
   ],
include: /node_modules/

如果反过来，include无效


include: [        
          path.resolve(__dirname, './node_modules/normalize.css'),      
      ],
      exclude: /node_modules/



