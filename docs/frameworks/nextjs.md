# راهنمای استفاده از دژبان در فریم ورک Next.js

## 1. نصب پیش نیاز ها
ابتدا لایبری [`@auth0/nextjs-auth0`](https://github.com/auth0/nextjs-auth0) را نصب کنید:
```bash
npm i @auth0/nextjs-auth0
```

?> توجه داشته باشید این راهنما بر اساس Next.js ورژن ***15.2*** به بالا تهیه شده است.

## 2. ساخت اپلیکیشن در سرویس دژبان
وارد پنل مدیریت دژبان شوید و پس از انتخاب دژ مربوطه از منوی بالای صفحه، وارد منوی "اپلیکیشن ها" شوید. سپس گزینه "اضافه کردن اپلیکیشن جدید" را انتخاب کنید. در صفحه جدید نام مناسب برای اپلیکیشن خود وارد کنید و نوع اپلیکیشن را "Traditional Web Application" انتخاب کرده و برای "آدرس ریدایرکت بعد از لاگین" مقدار `http://localhost:3000/auth/callback` را وارد کنید.

در صفحه جدید "ویرایش آدرس های اپلیکیشن" را انتخاب کرده و در قسمت "آدرس ریدارکت بعد از لاگ آت" مقدار `/` را وارد کنید.

## 3. تنظیم و اضافه کردن لایبری
یک فایل جدید در مسیر `libs/auth.ts` اضافه کنید و کد زیر را در آن قرار دهید. سپس مقادیر تنظیم شده را متناسب با سرویس خود تغییر دهید:

```typescript
import { Auth0Client } from "@auth0/nextjs-auth0/server";

const DEFAULT_SCOPES = ["openid", "profile", "email"].join(" ");

export const authClient = new Auth0Client({
  appBaseUrl: 'http://localhost:3000',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  secret: 'some_random_secret',
  domain: 'htttps://dezh.me/realms/your_realm',
  authorizationParameters: {
    scope: DEFAULT_SCOPES,
  },
});
```
- `appBaseUrl`: آدرسی که اپلیکیشن شما در آن بارگذاری می شود که معمولا این آدرس در محیط توسعه `http://localhost:3000` می باشد.
- `clientId` و `clientSecret`: این مقادیر متاسب با اپلیکیشن ایجاد شده در کنسول دژبان قابل دسترسی هستند. برای اطلاعات بیشتر می توانید به مستندات فنی دژبان مراجعه کنید.
- `secret`: یک رشته تصادفی است که برای رمزگذاری کوکی ها استفاده می شود. یک روش ساخت این رشته استفاده از دستور `openssl rand -hex 32` در محیط لینوکس می باشد.
- `domain`: آدرس مربوط به دژ شما در دژبان. این آدرس از طریق کنسول دژبان قابل دسترسی است.

?> آدرس `http://localhost:3000/auth/callback` باید به عنوان آدرس برگشت از لاگین و آدرس `http://localhost:3000` به عنوان آدرس برگشت از لاگات در کنسول ذژبان ذخیره شده باشد. برای اطلاعات بیشتر به مستندات فنی مربوطه مراجعه کنید.

## 4. اضافه کردن middleware
یک فایل جدید با نام `middleware.ts` در مسیر ابتدای پروژه ایجاد کرده و کد زیر را در آن قرار دهید:

```typescript
import type { NextRequest } from "next/server"

import { authClient } from "./lib/auth"

export async function middleware(request: NextRequest) {
  return await authClient.middleware(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
```

?> در صورتی که از آدرس `src/` استفاده می کنید، فایل middleware باید در این مسیر قرار بگیرد. جهت اطلاعات بیشتر به مستندات فنی مربوطه مراجعه کنید.

## 4. هدایت کاربران به صفحه لاگین
برای احراز هویت کاربران کافیست کاربر به آدرس `/auth/login` هدایت شود.

```jsx
import { authClient } from "@/lib/auth"

export default async function Home() {
  const session = await authClient.getSession()

  if (!session) {
    return (
      <main>
        <a href="/auth/login">Login / Register</a>
      </main>
    )
  }

  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
    </main>
  )
}
```
?> توجه کنید که حتمن از تگ `<a>` به جای `<Link>` استفاده کنید تا مطمعین باشید که جا به جایی بین صفحات به صورت کلاینت ساید اتفاق نمی افتد.


## نمونه کد
برای مشاهده و بررسی نمونه کد می توانید به ریپازیتوری زیر مراجعه کنید:

https://github.com/dezhban/example-nextjs


## لایبری های مرتبط
در صورتی که لایبری `@auth0/nextjs-auth0` جوابگوی نیاز های شما نیست، می توانید از لایبری های زیر استفاده کنید:
- lib1
- lib2
- lib3