# AMO 图片性能优化报告

修改前的 Git 标签为 `backup/amo-before-image-optimization-20261125`（`3dfe227061e2d54f10cb3cafce9a8b5e3c2b8741`），包含当时的工作区和暂存区。原有图片 URL、源文件和 SEO 元数据保留。

## 图片压缩前后对比

以下以十进制 KB 计。优化前按仓库源文件，优化后按每张图最大宽度的 WebP 计算。浏览器按视口、容器和设备像素比选择一份资源，实际流量以其选中的版本为准。

| 用途 | 源图数 | 优化前合计（KB） | 最大宽度版本合计（KB） | 最大单张（KB） |
| --- | ---: | ---: | ---: | ---: |
| 全屏及大图 | 70 | 10,681.8 | 5,872.6 | 172.2 |
| 普通图片 | 29 | 1,705.1 | 1,533.6 | 272.5 |
| 本地产品图 | 4 | 5,462.0 | 102.9 | 33.8 |
| 标志、图标和二维码 | 3 | 4.5 | 0.8 | 3.8 |
| 合计 | 106 | 17,853.3 | 7,510.0 | — |

四张本地产品图的 480px 及以下版本最大为 5.8 KB。只读检查确认，已有 74 张 Supabase 产品大图最大 205.8 KB，已有缩略图最大 55.4 KB。39 张已有博客封面与仓库文件的 SHA-256 一致，页面使用对应的本地 WebP 尺寸，数据库和 SEO 继续引用原地址。

### 逐图明细

| 源文件 | 优化前（KB） | 最小宽度及体积 | 最大宽度及体积 |
| --- | ---: | ---: | ---: |
| `/amo-favicon.png` | 2.0 | 22px / 0.2 KB | 22px / 0.2 KB |
| `/amo-logo-white.png` | 1.9 | 37px / 0.2 KB | 37px / 0.2 KB |
| `/downloads/amo-whatsapp-qr.png` | 0.6 | 64px / 2.5 KB | 512px / 0.4 KB |
| `/images/about/about-ch02-question-reality.webp` | 31.2 | 384px / 2.5 KB | 1600px / 23.4 KB |
| `/images/about/about-ch04-light-reflection.webp` | 65.8 | 384px / 18.8 KB | 1122px / 65.8 KB |
| `/images/about/about-ch04-magnetic-pattern.webp` | 272.5 | 384px / 58.1 KB | 1122px / 272.5 KB |
| `/images/about/about-ch04-metal-surface.webp` | 39.4 | 384px / 7.7 KB | 1122px / 39.4 KB |
| `/images/about/about-ch04-precision-edge.webp` | 50.7 | 384px / 10.8 KB | 1122px / 50.7 KB |
| `/images/about/about-ch05-balance-system.webp` | 24.7 | 384px / 6.0 KB | 1122px / 24.7 KB |
| `/images/about/about-ch05-levitation-ring.webp` | 39.4 | 384px / 7.9 KB | 1122px / 39.4 KB |
| `/images/about/about-ch05-magnetic-field.webp` | 175.2 | 384px / 25.7 KB | 1122px / 175.2 KB |
| `/images/about/about-ch05-motion-path.webp` | 17.1 | 384px / 4.0 KB | 1122px / 17.1 KB |
| `/images/about/about-ch07-architecture.webp` | 67.4 | 384px / 7.2 KB | 1600px / 50.3 KB |
| `/images/about/about-ch07-future-workspace.webp` | 64.6 | 384px / 6.9 KB | 1600px / 49.8 KB |
| `/images/about/about-ch07-hospitality.webp` | 108.1 | 384px / 9.2 KB | 1600px / 80.4 KB |
| `/images/about/about-ch07-museum.webp` | 40.5 | 384px / 4.8 KB | 1600px / 32.8 KB |
| `/images/about/about-ch07-retail.webp` | 44.1 | 384px / 6.0 KB | 1600px / 36.4 KB |
| `/images/about/original/about-ch02-question-reality.jpg` | 1,332.5 | 480px / 5.8 KB | 1672px / 52.1 KB |
| `/images/blog/heroes/2026-retail-display-trends-how-brands-create-attention-without-more-advertising.webp` | 148.2 | 480px / 19.8 KB | 1600px / 125.7 KB |
| `/images/blog/heroes/branded-magnetic-levitation-logo-customization-packaging.webp` | 13.9 | 480px / 6.0 KB | 1200px / 13.9 KB |
| `/images/blog/heroes/can-magnetic-levitation-displays-run-all-day.webp` | 149.2 | 480px / 24.7 KB | 1600px / 128.5 KB |
| `/images/blog/heroes/compare-magnetic-levitation-rfq-pricing-hidden-costs.webp` | 59.0 | 480px / 26.9 KB | 1200px / 59.0 KB |
| `/images/blog/heroes/corporate-gifts-that-people-actually-remember.webp` | 60.2 | 480px / 6.6 KB | 1600px / 47.6 KB |
| `/images/blog/heroes/custom-magnetic-levitation-display-manufacturer.webp` | 90.2 | 480px / 14.5 KB | 1600px / 77.3 KB |
| `/images/blog/heroes/floating-display-for-jewelry-stores.webp` | 31.5 | 480px / 4.4 KB | 1600px / 26.5 KB |
| `/images/blog/heroes/floating-display-for-perfume-brands.webp` | 87.3 | 480px / 14.7 KB | 1600px / 76.7 KB |
| `/images/blog/heroes/floating-display-for-watch-brands.webp` | 72.6 | 480px / 12.8 KB | 1600px / 63.0 KB |
| `/images/blog/heroes/floating-display-manufacturer-guide.webp` | 44.4 | 480px / 7.1 KB | 1600px / 37.6 KB |
| `/images/blog/heroes/global-procurement-checklist-magnetic-levitation-products.webp` | 42.9 | 480px / 17.5 KB | 1200px / 42.9 KB |
| `/images/blog/heroes/high-end-magnetic-levitation-materials-finishes-quality.webp` | 8.9 | 480px / 4.3 KB | 1200px / 8.9 KB |
| `/images/blog/heroes/how-does-a-magnetic-levitation-display-work.webp` | 120.4 | 480px / 15.8 KB | 1600px / 103.7 KB |
| `/images/blog/heroes/how-much-does-a-custom-magnetic-levitation-display-cost.webp` | 199.2 | 480px / 28.4 KB | 1600px / 167.1 KB |
| `/images/blog/heroes/how-to-choose-a-magnetic-levitation-display-stand.webp` | 93.1 | 480px / 13.6 KB | 1600px / 79.0 KB |
| `/images/blog/heroes/how-to-choose-a-magnetic-levitation-manufacturer.webp` | 90.2 | 480px / 14.5 KB | 1600px / 77.3 KB |
| `/images/blog/heroes/how-to-set-up-a-magnetic-levitation-display.webp` | 95.6 | 480px / 16.3 KB | 1600px / 82.8 KB |
| `/images/blog/heroes/ip-tooling-ownership-contract-custom-levitation-projects.webp` | 29.0 | 480px / 10.4 KB | 1200px / 29.0 KB |
| `/images/blog/heroes/is-magnetic-levitation-safe-for-watches-and-electronics.webp` | 108.6 | 480px / 19.4 KB | 1600px / 93.7 KB |
| `/images/blog/heroes/less-object-more-experience.webp` | 31.5 | 480px / 4.4 KB | 1600px / 26.5 KB |
| `/images/blog/heroes/magnetic-levitation-corporate-gifts.webp` | 60.2 | 480px / 6.6 KB | 1600px / 47.6 KB |
| `/images/blog/heroes/magnetic-levitation-display-manufacturer-china.webp` | 155.4 | 480px / 18.2 KB | 1600px / 137.9 KB |
| `/images/blog/heroes/magnetic-levitation-feasibility-review-before-oem-design.webp` | 27.2 | 480px / 13.8 KB | 1200px / 27.2 KB |
| `/images/blog/heroes/magnetic-levitation-gift-ideas.webp` | 204.9 | 480px / 29.7 KB | 1600px / 172.2 KB |
| `/images/blog/heroes/magnetic-levitation-mass-production-quality-control.webp` | 42.9 | 480px / 17.5 KB | 1200px / 42.9 KB |
| `/images/blog/heroes/magnetic-levitation-vs-rotating-display-stand.webp` | 151.0 | 480px / 22.3 KB | 1600px / 131.5 KB |
| `/images/blog/heroes/moq-sampling-lead-time-magnetic-levitation-products.webp` | 90.2 | 480px / 14.5 KB | 1600px / 77.3 KB |
| `/images/blog/heroes/museum-displays-creating-distance-focus-and-curiosity.webp` | 70.9 | 480px / 7.9 KB | 1600px / 58.6 KB |
| `/images/blog/heroes/oem-floating-display-projects.webp` | 107.1 | 480px / 10.9 KB | 1600px / 90.2 KB |
| `/images/blog/heroes/oem-magnetic-levitation-products-from-concept-to-production.webp` | 107.1 | 480px / 10.9 KB | 1600px / 90.2 KB |
| `/images/blog/heroes/pilot-order-to-multi-location-magnetic-levitation-rollout.webp` | 23.3 | 480px / 12.4 KB | 1200px / 23.3 KB |
| `/images/blog/heroes/shortlist-magnetic-levitation-supplier-premium-oem.webp` | 27.2 | 480px / 13.8 KB | 1200px / 27.2 KB |
| `/images/blog/heroes/the-complete-b2b-sourcing-guide-for-magnetic-levitation-products.webp` | 155.4 | 480px / 18.2 KB | 1600px / 137.9 KB |
| `/images/blog/heroes/the-future-of-floating-objects-why-magnetic-levitation-is-changing-product-presentation.webp` | 44.4 | 480px / 7.1 KB | 1600px / 37.6 KB |
| `/images/blog/heroes/validate-magnetic-levitation-prototype-sample-approval.webp` | 29.0 | 480px / 10.4 KB | 1200px / 29.0 KB |
| `/images/blog/heroes/what-is-magnetic-levitation-used-for.webp` | 121.4 | 480px / 17.7 KB | 1600px / 106.7 KB |
| `/images/blog/heroes/what-objects-can-float-on-a-magnetic-levitation-display.webp` | 114.7 | 480px / 16.6 KB | 1600px / 99.9 KB |
| `/images/blog/heroes/why-attention-is-the-most-valuable-space-in-retail.webp` | 72.6 | 480px / 12.8 KB | 1600px / 63.0 KB |
| `/images/blog/heroes/why-luxury-retail-stores-use-floating-product-displays.webp` | 87.3 | 480px / 14.7 KB | 1600px / 76.7 KB |
| `/images/cases/after-levitation-display.webp` | 151.9 | 480px / 23.3 KB | 1254px / 103.2 KB |
| `/images/cases/application-exhibition.webp` | 86.7 | 480px / 16.9 KB | 1400px / 79.5 KB |
| `/images/cases/application-gifts.webp` | 63.1 | 480px / 12.0 KB | 1400px / 58.6 KB |
| `/images/cases/application-hotel.webp` | 139.3 | 480px / 28.0 KB | 1400px / 125.9 KB |
| `/images/cases/application-museum.webp` | 78.1 | 480px / 13.4 KB | 1400px / 72.4 KB |
| `/images/cases/application-office.webp` | 110.0 | 480px / 23.6 KB | 1400px / 101.9 KB |
| `/images/cases/application-retail.webp` | 99.8 | 480px / 22.6 KB | 1400px / 92.9 KB |
| `/images/cases/before-standard-display.webp` | 104.7 | 480px / 20.7 KB | 1254px / 75.7 KB |
| `/images/cases/featured-case-retail.webp` | 181.3 | 480px / 28.1 KB | 1254px / 126.9 KB |
| `/images/cases/space-exhibition.webp` | 141.3 | 480px / 21.3 KB | 1672px / 118.3 KB |
| `/images/cases/space-hotel.webp` | 133.1 | 480px / 20.5 KB | 1672px / 110.4 KB |
| `/images/cases/space-museum.webp` | 89.4 | 480px / 11.9 KB | 1672px / 72.5 KB |
| `/images/cases/space-office.webp` | 112.7 | 480px / 15.6 KB | 1672px / 95.8 KB |
| `/images/cases/space-premium-gifts.webp` | 111.3 | 480px / 16.9 KB | 1672px / 93.3 KB |
| `/images/cases/space-retail-store.webp` | 191.7 | 480px / 27.0 KB | 1672px / 159.8 KB |
| `/images/home/applications/exhibition.webp` | 212.5 | 480px / 13.2 KB | 1920px / 77.4 KB |
| `/images/home/applications/hotel.webp` | 439.6 | 480px / 23.9 KB | 1920px / 168.1 KB |
| `/images/home/applications/museum.webp` | 287.4 | 480px / 11.5 KB | 1920px / 96.8 KB |
| `/images/home/applications/office.webp` | 424.4 | 480px / 18.0 KB | 1920px / 149.7 KB |
| `/images/home/applications/premium-gifts.webp` | 336.5 | 480px / 16.8 KB | 1920px / 118.2 KB |
| `/images/home/applications/retail.webp` | 376.0 | 480px / 17.2 KB | 1920px / 132.5 KB |
| `/images/home/future-objects/art-object.webp` | 254.2 | 480px / 10.7 KB | 1920px / 86.0 KB |
| `/images/home/future-objects/brand-installation.webp` | 420.2 | 480px / 16.8 KB | 1920px / 144.2 KB |
| `/images/home/future-objects/clock.webp` | 234.0 | 480px / 12.3 KB | 1920px / 81.0 KB |
| `/images/home/future-objects/display-base.webp` | 315.0 | 480px / 15.0 KB | 1920px / 113.7 KB |
| `/images/home/future-objects/lamp.webp` | 204.1 | 480px / 8.4 KB | 1920px / 66.0 KB |
| `/images/home/future-objects/oem-module.webp` | 299.6 | 480px / 13.4 KB | 1920px / 105.1 KB |
| `/images/home/hero/hero-bg.webp` | 221.3 | 480px / 4.7 KB | 1920px / 53.2 KB |
| `/images/home/technology/technology-bg.webp` | 243.5 | 480px / 7.7 KB | 1920px / 80.2 KB |
| `/images/oem/optimized/custom-branding.webp` | 64.0 | 384px / 5.5 KB | 1600px / 51.7 KB |
| `/images/oem/optimized/custom-lighting.webp` | 47.4 | 384px / 4.1 KB | 1600px / 37.0 KB |
| `/images/oem/optimized/custom-magnetic-module.webp` | 39.0 | 384px / 4.9 KB | 1600px / 33.1 KB |
| `/images/oem/optimized/custom-material.webp` | 15.0 | 384px / 1.9 KB | 1600px / 12.8 KB |
| `/images/oem/optimized/custom-motion-effect.webp` | 67.5 | 384px / 4.9 KB | 1600px / 52.6 KB |
| `/images/oem/optimized/custom-packaging.webp` | 52.5 | 384px / 3.9 KB | 1600px / 40.5 KB |
| `/images/oem/optimized/custom-product-shape.webp` | 79.5 | 384px / 10.3 KB | 1600px / 67.9 KB |
| `/images/oem/optimized/custom-surface-finish.webp` | 19.9 | 384px / 2.4 KB | 1600px / 17.1 KB |
| `/images/oem/optimized/development-capability.webp` | 36.5 | 384px / 3.7 KB | 1600px / 30.3 KB |
| `/images/oem/optimized/industry-brand-activations.webp` | 23.6 | 384px / 3.5 KB | 1536px / 23.0 KB |
| `/images/oem/optimized/industry-corporate-gifts.webp` | 53.4 | 384px / 6.9 KB | 1536px / 50.6 KB |
| `/images/oem/optimized/industry-exhibitions.webp` | 51.6 | 384px / 7.4 KB | 1536px / 49.2 KB |
| `/images/oem/optimized/industry-hospitality.webp` | 44.4 | 384px / 6.4 KB | 1536px / 42.0 KB |
| `/images/oem/optimized/industry-museums.webp` | 27.7 | 384px / 3.9 KB | 1536px / 26.5 KB |
| `/images/oem/optimized/industry-retail.webp` | 42.5 | 384px / 5.5 KB | 1536px / 41.4 KB |
| `/images/oem/optimized/oem-hero.webp` | 17.8 | 480px / 3.4 KB | 1717px / 17.8 KB |
| `/products/rendered/floating-display-sculpture-hero.png` | 1,334.6 | 160px / 1.5 KB | 1536px / 33.8 KB |
| `/products/rendered/levitating-clock-hero.png` | 1,631.1 | 160px / 1.1 KB | 1536px / 27.3 KB |
| `/products/rendered/levitating-lamp-hero.png` | 1,283.1 | 160px / 1.0 KB | 1536px / 16.9 KB |
| `/products/rendered/oem-maglev-platform-hero.png` | 1,213.1 | 160px / 1.2 KB | 1536px / 24.9 KB |

## 修改文件清单

本地素材可通过 `npm run optimize:site-images` 重新生成。脚本由 Node.js 24.16.0 运行，并将每个源图及各尺寸的字节数以 JSON 输出到标准输出。

- `app/blog/[slug]/page.tsx`
- `components/about/about-page-experience.tsx`
- `components/admin/admin-featured-products-manager.tsx`
- `components/admin/admin-products-console.tsx`
- `components/cases/case-stage-visual.tsx`
- `components/cases/cases-page-experience.tsx`
- `components/company-deck/CompanyDeck.tsx`
- `components/company-deck/DeckSlide.tsx`
- `components/favorites/favorites-page.tsx`
- `components/home/home-blog.tsx`
- `components/home/home-categories.tsx`
- `components/home/home-hero.tsx`
- `components/home/home-page.tsx`
- `components/home/home-scenarios.tsx`
- `components/home/home-technical.tsx`
- `components/layout/approved-home-footer.tsx`
- `components/layout/shared-site-nav.tsx`
- `components/oem/oem-odm-page-experience.tsx`
- `components/products/nexus-product-card.tsx`
- `components/products/product-card.tsx`
- `components/products/product-detail-experience.tsx`
- `components/products/product-showcase.tsx`
- `components/products/product-thumb-rail.tsx`
- `components/products/products-page-story-sections.tsx`
- `components/sales-deck/SalesDeck.tsx`
- `components/sales-deck/SalesDeckSlide.tsx`
- `components/ui/ArticleCard.tsx`
- `components/ui/responsive-image.tsx`
- `docs/AMO_IMAGE_OPTIMIZATION_REPORT.md`
- `lib/admin/blogs.ts`
- `lib/admin/products.ts`
- `lib/images/image-sources.ts`
- `lib/images/legacy-image-variants.json`
- `lib/images/site-image-manifest.json`
- `lib/server/encode-webp.ts`
- `lib/server/product-image-pipeline.ts`
- `next.config.ts`
- `package.json`
- `pnpm-lock.yaml`
- `public/downloads/AMO_B2B_Sales_Deck.html`
- `public/downloads/AMO_Company_Profile_Deck.html`
- `scripts/optimize-site-images.ts`
- `public/image-variants/` 下的 408 张 WebP。完整路径可由 `lib/images/site-image-manifest.json` 中的 `base` 和 `widths` 组合得到。

## 构建检查

- `npm run build` 通过，包含 TypeScript、ESLint 和 25 个静态页面的生成。构建提示本地 Browserslist 数据较旧。
- Sharp 检查了所有生成文件的格式、实际尺寸、宽高比和分类字节上限。
- Supabase 本地模拟测试覆盖产品和博客上传、损坏文件、部分上传失败和已上传副本清理。线上 Supabase 仅执行了只读验证。

## 浏览器网络检查

- Chrome 桌面端使用 1440px、DPR 1，移动端使用 390px、DPR 2。首页分别只请求一份 1920px 和 1200px 的首屏 WebP，分别为 53.2 KB 和 24.9 KB。
- 直接请求 `/_next/image` 返回 HTTP 404。两份历史下载版 HTML 中的 192 处去重后的 WebP 引用按文件校验通过。
- 页面导航时记录了图片请求。对需复测的页面进行了不修改页面图片属性的复测，区分了测试强制触发懒加载时的 React 警告和页面本身的行为。

- 桌面和移动端各验证 130 个公开页面，包含六个指定入口、3 个案例详情、74 个产品详情、41 个博客详情及其他公开页面。所有页面均返回 HTTP 200，图片解码通过，浏览器共记录 0 次 `/_next/image` 请求。

## 潜在风险

- 仓库保留原始图片以兼容旧链接和 SEO。全部预生成版本额外占用约 15.78 MB 的部署文件空间。
- 已核验的 Supabase 对象使用已知尺寸。若在 Storage 中直接替换同名对象，尺寸记录或博客本地副本需要同步更新。未收录的旧图仍按数据库原 URL 直接加载，文件体积取决于存储中的原图。
- 上传压缩在应用服务端执行，浏览器仍须先将原文件提交到应用。大文件可能先触及部署平台的请求体上限。新产品后台的原始槽位存放压缩后的 WebP。
- 本次验证基于本地生产构建。Vercel 仪表盘需在部署后查看新流量的数据。
