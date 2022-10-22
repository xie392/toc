console.log("%c 自动生成目录 ", "color: #fff; background: #000;padding: 5px;");

window.addEventListener("load", () => tocList())

const tocList = () => {
  const toc = document.querySelector(".toc");
  const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  if (!elements.length) return;
  const HList = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  // 生成目录
  let str = `<div class="dir">\n<ul id="toc">`;
  Array.from(elements, v => {
    const H = HList.indexOf(v.nodeName) + 1 || 1;
    str += `<li class="li li-${H}"><a href="javascript:void(0);" id="${v.id}" >${v.textContent}</a></li>\n`;
  })
  str += `</ul>\n`;
  str += `<div class="sider"><span class="siderbar"><span></div>\n</div>`;
  // 添加目录到页面
  toc.insertAdjacentHTML("beforeend", str);

  // 给目录添加点击事件
  Array.from(elements, v => {
    const btn = document.querySelector(`#toc #${v.id}`);
    const ele = document.querySelector(`.container #${v.id}`);
    if (!btn || !ele) return;
    btn.addEventListener("click", () => {
      window.scrollTo({ top: ele.offsetTop - 80, behavior: "smooth" });
    })
  })

  // 监听滚动
  const observer = new IntersectionObserver(visibleChnage);
  Array.from(elements, item => observer.observe(item));
}


// 移除所有的 li-active 排他
const removeClass = () => {
  const list = document.querySelectorAll("#toc .li a");
  Array.from(list, v => v.classList.remove("li-active"));
}

// 监听滚动
const visibleChnage = (item) => {
  var sider = document.querySelector(".siderbar");
  var toc = document.querySelectorAll("#toc .li a");
  item.forEach(observe => {
    const id = observe.target.getAttribute('id'), anchor = document.querySelector(`#toc .li #${id}`);
    
    if (!anchor) return false;

    if (observe.isIntersecting) {
      removeClass();
      const index = Array.from(toc, v => v.getAttribute('id')).indexOf(id);
      anchor.classList.add("li-active");
      sider.style.transform = `translateY(${index * 30 + 10}px)`;
      return;
    }
  });
}


