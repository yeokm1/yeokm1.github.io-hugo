---
title: "添加中文支持"
date: 2020-08-17
categories: ["管理"]
images: ["/zh/2020/08/添加中文支持/images/title-post-capture.png"]
---

我在一个中国科技公司已经工作几个月了。我发觉自己必须提高本身的中文水平, 尤其是在科技词汇方面，而不只是选择用英文的词汇的捷径。

唯一的方法是尽量在工作环境外使用中文。但在新加玻，除了来自中国的科技公司之外，没人使用中文的科技词汇。因此，我预计自己很少有机会来练习。

我写了很多关已科技类的博格文章。所以我想到了不如用双语来写文章。但首先必须调整个人的博客配置来接受肯多语言。

(起初的英文文章能在[这里找到](/2020/08/adding-chinese-support-to-my-blog/)。)

<!--more-->

我的博客使用Hugo "静态网站生成器" (static site generator). 我先去[Hugo 网站](https://gohugo.io/content-management/multilingual/)研究怎样开始。

## 1. 调整网站配置

每个Hugo 网站都有一个`config.toml`来指定网站的信息，URL，标题， 主题和其他参数. 它也有特定主题的配置。我用的主题是[hugo-future-imperfect-slim](https://themes.gohugo.io/hugo-future-imperfect-slim/)。

特定主题的文档能在这个[网站]((https://github.com/pacollins/hugo-future-imperfect-slim/wiki/config.toml)) 找到。

以下是我简化的`config.toml`。

```
DefaultContentLanguage  = "en"

[Languages.zh.params.header]
    # Sets the navbarTitle that appears in the top left of the navigation bar
    navbarTitle         = "庆铭网角"
...
    
  [Languages.zh.params.intro]
    header                = "杨庆铭"
    paragraph             = "制作者，程序员，私人飞行员, 复古电脑爱好者"
...

    [Languages.zh.params.intro.pic]
      src                 = "/img/main/logo.jpg"
      alt                 = "庆铭头像照片"

   [[Languages.zh.menu.main]]
      name              = "主页"
      identifier        = "home"
...

   [[Languages.zh.menu.main]]
      name              = "飞行"
      identifier        = "aviation"
      url               = "/categories/飞行"
...

   [[Languages.zh.menu.main]]
      name              = "复古电脑"
      identifier        = "retrocomputing"
      url               = "/categories/复古电脑"
...

   [[Languages.zh.menu.main]]
      name              = "类别"
      identifier        = "categories"
      url               = "/categories/"
...

   [[Languages.zh.menu.main]]
      name              = "喜爱报价"
      identifier        = "quotes"
      url               = "/favourite-quotes/"
...

  [[Languages.zh.menu.main]]
    name              = "关于我"
    identifier        = "about"
    url               = "/about-me/"
...
```

每个选单必须提供中文翻译。

我找不到"retrocomputing"的中文翻译. 我问一个朋友他建议我用"复古电脑"。

{{< imgdisplay src="images/language-selection-mode.png" width="350" >}}

重新下载网页后，主题提供了语言选择。

## 2. 写双语文章

Hugo 建议两种放法来分开语言内容。

### a. 目录

这种方法需要您把内容放在不同的目录。

```
  [languages.en]
    contentDir = "content/english"
    languageName = "English"
    weight = 10
  [languages.zh]
    contentDir = "content/chinese"
    languageName = "简体中文"
    weight = 20
```

### b. 文件名

第二种方法是用不同的文件名称。

```
/content/post/2020/08/adding-chinese-support-to-my-blog/index.md
/content/post/2020/08/adding-chinese-support-to-my-blog/index.en.md
/content/post/2020/08/adding-chinese-support-to-my-blog/index.zh.md
```

如果文件名没有语言"en"和"zh"指标，Hugo 将选默认语言。

我选择了第二方法因为我要中英的内容在同一个目录，比较容易维护。可是我没用 `index.en.md` 在英文文件的名称。 使用 "en" 的指标会导致有 `/en/` 的下子目录，可能断开第三方网页的链接。

## 3. 翻译文件元数据

如果你刚加了肯多语言支持，你会看到这个。

{{< imgdisplay src="images/fresh-chinese-support-no-data.png" width="500" >}}

完全空白的因为现有的文章都是英文的。所以我们必须添加一些中文文章。

### a. 将文件英文名重复到中文名

```bash
find . -name index.md -exec dirname {} \; | xargs -I % sh -c 'cp %/index.md %/index.zh.md;'
```

为了让英文文章出现在中文配置，我用上面的命令来加了有"zh"指标的文档。

### b. 换英语类别

```bash
find . -name index.zh.md | xargs -I % sh -c "sed -i 's/\"Singapore\"/\"新加玻\"/g' %"
```

我们之后需要修改每个文章的Hugo前提。 `categories: ["Singapore"]` -> `categories: ["新加玻"]`。每个类别都要运行。

最后， 我返回了这些修改。因为我发现到Hugo在处理每个中英文章时后，创建了两组图片，导致我的网站超过了[Github Pages 1GB 的限制](https://docs.github.com/en/github/managing-large-files/what-is-my-disk-quota#file-and-repository-size-limitations)。

我选择保留了上面的UNIX命令，可能对他人有帮助。

## 评论问题

我使用了Disqus和Facebook的评论系统。它们需要你提供文章的URL然后它会下载文章具体的评论。我用了这个代码.

```html
<div class="fb-comments" data-href="{{ .Permalink }}" data-width="100%" data-numposts="5"></div>
```

`"{{ .Permalink }}"` 是让Hugo插件了页面的URL.

问题是，不同语言页面会有不同的URL。

```
https://yeokhengmeng.com/2020/08/adding-chinese-support-to-my-blog/
https://yeokhengmeng.com/zh/2020/08/adding-chinese-support-to-my-blog/
```

不同的URL导致我不能结合中英的评论。我现在无法解决这个问题。

## 结论

我的博客现在有了双语架构。以后，新的文章我尽量用双语来写。

我的中文水平老实说是很差， 所以我用了Google和百度翻译系统来帮我翻译我不懂的词汇。然后，确认翻译的词汇有意义，并且能传达个人的写作风格。

因此我的中文版本并不是直接从英文版本翻译过去。如果您不信，可以自己试试用Google Translate来查看自动翻译的结果。

起初的英文文章能在[这里找到](/2020/08/adding-chinese-support-to-my-blog/)。



