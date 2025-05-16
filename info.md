开发一个管理系统系统 第一阶段先完成以下功能

### 功能点拆分：
#### 登录模块：
    1 登录功能： 登录页面风格参考github，用户输入 用户名密码，点击登录，跳转到主页面。
    2 用户注册功能： 登录页面下方有注册链接，点击注册，跳转到注册页面。注册页面参数包括：
        用户名，密码，确认密码，邮箱，手机号，验证码（使用邮箱验证码）。
    3 忘记密码： 登录页面下方有忘记密码链接，点击忘记密码，跳转到忘记密码页面。忘记密码页面参数包括：
        用户名，邮箱，验证码（使用邮箱验证码），新密码，确认新密码。
#### 
3 上方菜单栏：通过菜单接口返回展示
   工作台：展示四个统计数据：当前用户的待办事项数量，当前用户的已办事项数量，当前用户的待审批事项数量，当前用户的已审批事项数量。
   协同工作：该菜单下包括一些子菜单  如： 待办事项，已办事项，待审批事项，已审批事项。
   公共服务：该菜单下包括一些子菜单  如： 请假申请，报销申请，出差申请，加班申请。


### API接口
1 登录接口
POST /api/auth/login
Content-Type: application/json

{
  "username": "dev_user",
  "password": "P@ssw0rd!"
}

响应：
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "access_token": "eyJhbGci...",
    "refresh_token": "eyJhbGci...",
    "user_info": {
      "username": "dev_user",
      "avatar": "https://avatars.githubusercontent.com/u/123456"
    }
  }
}

2 邮箱验证码发送接口
POST /api/auth/send-verification-code
Content-Type: application/json

{
  "email": "user@example.com",
  "purpose": "REGISTER"  // REGISTER|RESET_PASSWORD
}

响应：
{
  "code": 200,
  "message": "验证码已发送",
  "data": {
    "expire_in": 300  // 有效期秒数
  }
}

3 用户注册接口
POST /api/auth/register
Content-Type: application/json

{
  "username": "dev_user",
  "password": "P@ssw0rd!",
  "confirm_password": "P@ssw0rd!",
  "email": "user@example.com",
  "phone": "13800138000",
  "verification_code": "A1B2C3"
}

响应：
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "user_id": "U20250515001",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

4 密码重置接口
POST /api/auth/reset-password
Content-Type: application/json

{
  "username": "dev_user",
  "email": "user@example.com",
  "new_password": "NewP@ss123",
  "confirm_password": "NewP@ss123",
  "verification_code": "D4E5F6"
}

响应：
{
  "code": 200,
  "message": "密码已更新"
}

5 获取菜单列表接口
GET /api/menu/list

响应：
     {
	"code": 200,
	"message": "success",
	"data": [
		{
			"name": "协同工作",
			"code": "xietong",
			"path": "",
			"icon": "el-icon-monitor",
			"children": [
				{
					"name": "待办事项",
					"code": "todo",
					"path": "/todo",
					"icon": "el-icon-document",
					"children": null
				},
				{
					"name": "已办事项",
					"code": "done",
					"path": "/done",
					"icon": "el-icon-check",
					"children": null
				}
			]
		},
		{
			"name": "公共服务",
			"code": "gg",
			"path": "",
			"icon": "el-icon-service",
			"children": [
				{
					"name": "请假申请",
					"code": "qingjia",
					"path": "/qingjia",
					"icon": "el-icon-time",
					"children": null
				},
				{
					"name": "报销申请",
					"code": "baoxiao",
					"path": "/bx",
					"icon": "el-icon-money",
					"children": null
				}
			]
		}
	]
}