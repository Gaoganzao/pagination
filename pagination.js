class Pagination {
    constructor(element, config, callback) {
        this.element = element;  // 乘载容器
        this.config = config || {};  // 用户设置
        this.list = null;  // 存储页码
        this.callback = callback || function () { };  // 回调函数
        // 默认设置参数
        this.default = {
            // 数据信息
            page: {
                current: 1,  // 当前页
                total: 100,  // 总页数
                least: 10,  // 当总页数低于这个数的时候设置全部显示
                size: 4  // 一次显示多少页数据,4页就是1,2,3,4....倒数第二,倒数第一
            },
            // 文本信息
            text: {
                first: "首页",  // 第一页
                prev: "上一页",  // 上一页
                list: "",  // 存1,2,3...页数的列表
                next: "下一页",  // 下一页
                last: "尾页"  // 最后一页
            }
        };
        this.init();
    }

    init() {
        // 初始化参数
        this.set_default();
        // 初始化首页,上一页,下一页,尾页,跳转
        this.create_buttons();
        // 显示页码
        this.flush();
        // 绑定单击事件绑定按钮,前一页,后一页之类的单击事件
        this.bind_click();
        // 检查输入框的值是否合法
        this.check_input();
    }

    set_default() {
        this.element.innerHTML = "";
        for (let key in this.config.page) {
            this.default.page[key] = this.config.page[key];
        }
        for (let key in this.config.text) {
            this.default.text[key] = this.config.text[key];
        }
    }

    close_button() {
        // 获取当前页码,不涉及数字算术操作,所以不使用parseInt
        let current = +this.default.page.current;
        // 获取div按钮,也就是首页,上一页,下一页,尾页
        let $divs = this.element.querySelectorAll("div");
        // 如果在第一页
        if (current === 1) {
            // 添加不可活动类
            $divs[0].classList.add("noactive");  // 首页按钮
            $divs[1].classList.add("noactive");  // 上一页按钮
            return;
        } else {
            // 移除不可活动类
            $divs[0].classList.remove("noactive");  // 首页按钮
            $divs[1].classList.remove("noactive");  // 上一页按钮
        }
        // 如果在最后一页
        if (current === this.default.page.total) {
            // 添加不可活动类
            $divs[3].classList.add("noactive")  // 下一页按钮
            $divs[4].classList.add("noactive")  // 尾页按钮
            return;
        } else {
            // 移除不可活动类
            $divs[3].classList.remove("noactive")  // 下一页按钮
            $divs[4].classList.remove("noactive")  // 尾页按钮
        }
    }

    create_indicator(page, current) {
        let $indicator = document.createElement("div");
        $indicator.innerHTML = page;
        // 当前页的css样式
        $indicator.classList.add("self-index");
        (page === current) && $indicator.classList.add("active");
        // 返回创建好的元素对象
        return $indicator;
    }

    flush() {
        // 清空前面的页码
        this.list.innerHTML = "";
        let current = parseInt(this.default.page.current),  // 获取当前页码
            total = parseInt(this.default.page.total),  // 获取总页数
            least = parseInt(this.default.page.least),  // 当总页数低于这个数的时候设置全部显示
            size = parseInt(this.default.page.size);  // 一次显示多少页数据,4页就是1,2,3,4....倒数第二,倒数第一
        // 输入框数字更新
        this.element.querySelector("input.self-input").value = current;
        // 按钮禁用更新
        this.close_button();
        // 启用回调,返回当前页码
        this.callback(current);
        if (total <= least) {
            // 显示全部页码
            for (let i = 1; i <= total; i++) {
                // 创建元素
                let $indicator = this.create_indicator(i, current);
                // 添加到页码list
                this.list.appendChild($indicator);
            }
        } else {
            // 总页数大于了设置的最低页数(least)
            // 判断当前页是否小于设置的最低显示页数(size)
            if (current < size) {
                for (let i = 1; i <= size; i++) {
                    // 创建元素
                    let $indicator = this.create_indicator(i, current);
                    // 添加到页码list
                    this.list.appendChild($indicator);
                }
                // 添加...
                let $em = document.createElement("em");
                $em.innerText = "...";
                this.list.appendChild($em);
                // 再额外添加倒数两页
                for (let i = total - 1; i <= total; i++) {
                    // 创建元素
                    let $indicator = this.create_indicator(i, current);
                    // 添加到页码list
                    this.list.appendChild($indicator);
                }
            } else if (current === size) {
                // 当前的页(current)大于了设置的最低显示页数(size)等之类的条件
                // 当前页码等于一次显示的页码,从1,显示到size+2页
                for (let i = 1; i <= (size + 2); i++) {
                    // 创建元素
                    let $indicator = this.create_indicator(i, current);
                    // 添加到页码list
                    this.list.appendChild($indicator);
                }
                // 添加...
                let $em = document.createElement("em");
                $em.innerText = "...";
                this.list.appendChild($em);
                // 再额外添加倒数两页
                for (let i = total - 1; i <= total; i++) {
                    // 创建元素
                    let $indicator = this.create_indicator(i, current);
                    // 添加到页码list
                    this.list.appendChild($indicator);
                }
            } else if (current > size && current < (total - size)) {
                // 显示前二页
                for (let i = 1; i <= 2; i++) {
                    // 创建元素
                    let $indicator = this.create_indicator(i, current);
                    // 添加到页码list
                    this.list.appendChild($indicator);
                }
                // 添加...
                let $em1 = document.createElement("em");
                $em1.innerText = "...";
                this.list.appendChild($em1);
                // 显示中间的
                for (let i = current; i <= (current + size); i++) {
                    // 创建元素
                    let $indicator = this.create_indicator(i, current);
                    // 添加到页码list
                    this.list.appendChild($indicator);
                }
                // 添加...
                let $em2 = document.createElement("em");
                $em2.innerText = "...";
                this.list.appendChild($em2);
                // 显示末尾的
                for (let i = total - 1; i <= total; i++) {
                    // 创建元素
                    let $indicator = this.create_indicator(i, current);
                    // 添加到页码list
                    this.list.appendChild($indicator);
                }
            } else {
                // 剩余的页数小于size,就全部显示出来
                // 显示前二页
                for (let i = 1; i <= 2; i++) {
                    // 创建元素
                    let $indicator = this.create_indicator(i, current);
                    // 添加到页码list
                    this.list.appendChild($indicator);
                }
                // 添加...
                let $em = document.createElement("em");
                $em.innerText = "...";
                this.list.appendChild($em);
                // 显示剩余的
                for (let i = (total - size); i <= total; i++) {
                    // 创建元素
                    let $indicator = this.create_indicator(i, current);
                    // 添加到页码list
                    this.list.appendChild($indicator);
                }
            }
        }
    }

    create_buttons() {
        // 创建上一页,首页,下一页,尾页
        for (let name in this.default.text) {
            let $div = document.createElement("div");
            if (name != "list") {
                // 设置class
                $div.className = "self-" + name;
                $div.innerHTML = this.default.text[name];
                // 设置样式
                this.element.appendChild($div);
            } else {  // 列表容器
                // 设置列表的class名
                $div.className = "self-list";
                this.list = $div;
                this.element.appendChild($div);
            }
        }

        // 创建输入框
        let $input = document.createElement("input");
        // 设置输入框类名
        $input.className = "self-input";
        // 设置显示页数
        $input.value = this.default.page.current;
        // 创建跳转按钮
        let $button = document.createElement("button");
        // 设定类名
        $button.className = "self-button";
        // 设置按钮内容
        $button.innerText = "前往";
        // 添加到容器
        this.element.appendChild($input);
        this.element.appendChild($button);
    }

    bind_click() {
        this.element.onclick = event => {
            // 兼容处理
            let $target = event.target || event.srcElement,
                current = parseInt(this.default.page.current),
                total = parseInt(this.default.page.total);
            // 首页 (判断class名字)
            if ("self-first" === $target.className && current != 1) {
                // 修改当前页数据
                this.default.page.current = 1;
                this.flush();
                return;
            }
            // 上一页
            if ("self-prev" === $target.className && current != 1) {
                this.default.page.current = --current;
                // 重新绘制
                this.flush();
                return;
            }
            // 下一页
            if ("self-next" === $target.className && current != total) {
                this.default.page.current = ++current;
                // 重新绘制
                this.flush();
                return;
            }
            // 尾页
            if ("self-last" === $target.className && current != total) {
                this.default.page.current = total;
                // 重新绘制
                this.flush();
                return;
            }
            // 用户单击了页码
            if ("self-index" === $target.className && current != $target.innerText) {
                // 重新设置页码
                this.default.page.current = $target.innerText;
                // 重新绘制
                this.flush();
                return;
            }
            // 用户单击了"确定"跳转到某一页
            if ("self-button" === $target.className && current != $target.previousElementSibling.value) {
                // 获取输入框的数字
                let value = $target.previousElementSibling.value;
                this.default.page.current = parseInt(value);
                this.flush();
                return;
            }
        }
    }

    check_input() {
        // 获取输入框
        let $input = this.element.querySelector("input.self-input");
        // 失去焦点事件
        $input.onblur = () => {
            // 获取输入框的值
            let value = parseInt($input.value), // 转化为整形
                current = this.default.page.current,  // 获取当前页
                total = this.default.page.total;  // 获取总页
            // 如果输入的值大于了最大的页数和小于了1
            if (value > total || value < 1) {
                // 不变动
                $input.value = current;
                return;
            }
            // 值为合法的值并且输入的值不等于当前的页码
            if (value && value != current) {
                // 更新当前页
                this.default.page.current = value;
                // 重新绘制
                this.flush();
            }
        }
        // 回车事件
        $input.onkeydown = event => {
            // 回车键被按下
            if (event.keyCode == 13 && parseInt($input.value) && this.default.page.current != parseInt($input.value)) {
                $input.onblur();
            }
        }
    }
}
