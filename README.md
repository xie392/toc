# 项目场景：
当网页有文章，文章中有很多标题。我们有时会需要生成目录大纲，以便他人查阅。生成目录到是不难，但是怎么实现目录跟随着页面滚动而改变目录的高亮标题？

---

#  获取所有标题，并生成大纲

```js
// 获取所有标题
let tocList = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
let HList = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

let str = `<div class="dir"><ul id="toc">`;
// 生成目录（你也可以更具自己需要生成一个对象也可以，我这里生成 html字符串）
Array.from(tocList,v => {
	const H = HList.indexOf(v.nodeName) + 1 || 1;  // 标题等级 1,2,3,4,5,6
    str += `<li class="li li-${H}">
    			<a href="javascript:void(0);" id="${v.id}" >${v.textContent}</a>
    		</li>\n`;
})
str += `</ul>`;
str += `<div class="sider"><span class="siderbar"><span></div></div>`;

// 添加 html 字符串到 页面
let toc = document.querySelector(".toc");
toc.insertAdjacentHTML("beforeend", str);

```

生成节点大概如下：（如果是vue或react可以生成对象，在页面渲染成大概这样子就行）

![在这里插入图片描述](https://img-blog.csdnimg.cn/4733c2a8cd194b4b9629820e5a81cd6f.png)

#  给每个目录节点绑定点击事件

为什么不用瞄点定位？a 标签 **#id** 确实可以定位到该标题，但这个我个人觉得有点不好用，如果顶部有导航栏，瞄点定位的标题会被顶部导航栏遮挡住，为了不被遮挡，可以给每个标题都添加一个 padding-top 或 margin-top 隔开顶部导航栏，但我不想那么做。

```js
Array.from(tocList,v => {
   const btn = document.querySelector(`#toc #${v.id}`);
   const ele = document.querySelector(`.container #${v.id}`);
   if (!btn || !ele) return;
  
	btn.addEventListener("click", () => {
      window.scrollTo({ top: ele.offsetTop - 80, behavior: "smooth" });
    })
})
```

#  监听滚动时目录高亮节点
这里不适用 scolll 来监听滚动，我这里用 **observe** 来监听

```js
const visibleChnage = (obs) => {
  var sider = document.querySelector(".siderbar");
  var toc = document.querySelectorAll("#toc .li a");
  item.forEach(observe => {
    // 找到对应的节点
    const id = observe.target.getAttribute('id'), anchor = document.querySelector(`#toc .li #${id}`);

    if (!anchor) return false;
    
    // 如果节点出现在可视视窗
    if (observe.isIntersecting) {
      // 排他（这个为了清除所有a标签中的类名 li-active）
      removeClass(); 
      // 目录 a 标签的类名为 li-active 时高亮
      anchor.classList.add("li-active");
       const index = Array.from(toc, v => v.getAttribute('id')).indexOf(id);
      // 左边高亮目录条
      sider.style.transform = `translateY(${index * 30}px)`;
    }
  });
}


 const observer = new IntersectionObserver(visibleChnage);
 // 监听滚动
 Array.from(tocList).map(item => observer.observe(item));

```

排他:  **removeClass()**

```js
// 移除所有的 li-active 排他
const removeClass = () => {
  const list = document.querySelectorAll("#toc .li a");
  Array.from(list,v => v.classList.remove("li-active"));
}
```


#  最终效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/d3aa71ceab7149c2b7a56b032a45f33c.png)


