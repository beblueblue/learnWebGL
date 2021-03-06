var CreateComposeImgs;
(function () {
    /** 图片合成类
    *
    * 参数
    * options（可选）: Object：
    *   canvas: Element, 绘制图片的画布对象，默认为新建一个canvas对象
    *   canvasWidth: Number, 绘制区域宽，（px） 默认为2048
    *   canvasHeight: Number, 绘制区域高，（px） 默认为2048
    *   canvasColor: String, 无背景图时，canvas默认背景色，默认为'#ffffff'
    *   baseUrl: String, 背景图地址
    *   foreUrl: Object或Array, 印刷图地址，单面Object, 多面Array
    *       Object: {
    *           url: 图片地址
    *           id: 对应图片配置数组foreConfigure的id
    *       }
    *   foreConfigure: Array, 印刷图的相关配置对象configureObj
    *       configureObj： {
    *           width: 150,
    *           height: 155,
    *           leftSpace: 1100,
    *           topSpace: 1250,
    *           id: 0,
    *       }
    *   leftSpace: Number, 图片绘制距离背景图左边缘的大小,（px）默认为0
    *   topSpace: Number, 图片绘制距离背景图上边缘的大小,（px）默认为0
    *   drawEnd: Function, 合成成功后的回调函数，此函数第一个参数为合成后图片的DataUrl
    *   
    * 方法
    * startDraw: 调用后，开始绘制
    * getComposedImg: 返回合成后的印刷图
    * clearImg: 清空所有面，保留背景
    * clearImgById( id ): 清空指定面
    * adjustImg( { width, height, leftSpace, topSpace, index } ): 调整指定面位置
    * drawImg: function ( { url = '', id = '' } ): 在现有图形上叠加新图
    * 
    * 实例属性说明
    * foreImg： Array，印刷图对象imgObj缓存数组
    *   imgObj: {
    *       img: 图片对象
    *       id: 对应图片配置数组foreConfigure的id
    *   }
    * foreConfigure: Array, 图片配置项configureObj缓存数组
    * foreUrl: Array, 图片地址foreUrl缓存数组
    * 
    */
  let loaderTotal = 0;
  let loaderEnd = 0;
  function composeImgs( options ){
    // 定义私有变量
    let _scope = this;
    let _defaultOpt = {
      canvasWidth: 2048,
      canvasHeight: 2048,
      canvasColor: '#ffffff',
    };

    // 读取默认配置项
    options = Object.assign( _defaultOpt, options );

    // 定义实例属性
    _scope.canvas = options.canvas || document.createElement( 'canvas' );
    _scope.ctx = _scope.canvas.getContext( '2d' );
    _scope.canvasWidth = options.canvasWidth;
    _scope.canvasHeight = options.canvasHeight;
    _scope.canvasColor = options.canvasColor;

    _scope.baseUrl = options.baseUrl;
    _scope.baseImg = null;

    _scope.foreUrl = options.foreUrl;
    _scope.foreImg = [];
    _scope.foreConfigure = options.foreConfigure || [];

    _scope.onload = options.onload || null;
    // 多面设计标志位，默认单面
    _scope.multiFlag = false;
    if ( _scope.foreUrl && Array.isArray( _scope.foreUrl ) ) {
        // 多面
        _scope.multiFlag = true;
    }

    this.startDraw = function () {
        let drawArr = [];

        _scope.canvas.width = _scope.canvasWidth;
        _scope.canvas.height = _scope.canvasHeight;
        
        // 判断背景图导入还是填充
        if ( _scope.baseUrl ) {
            _scope.baseImg = new Image();
            _scope.baseImg.src = options.baseUrl;
            if ( _scope.baseImg.complete ) {
                // 绘制背景图
                _scope.ctx.drawImage( _scope.baseImg, 0, 0 );
                                    
                // 处理印刷图
                if ( _scope.multiFlag ) {
                    drawArr = _scope.foreUrl;
                } else {
                    drawArr.push( _scope.foreUrl );
                    _scope.drawImg( {
                        url: _scope.foreUrl.url, 
                        id: _scope.foreUrl.id,
                    } );
                }
                // 绘制设计图
                [].forEach.call( drawArr, function (ele) {
                    _scope.drawImg( {
                        url: ele.url, 
                        id: ele.id,
                    } );
                } );
            } else {
                loaderTotal++;
                _scope.baseImg.onload = function(){
                    loaderEnd++;
                    // 绘制背景图
                    _scope.ctx.drawImage( _scope.baseImg, 0, 0 );
                    
                    // 处理印刷图
                    if ( _scope.multiFlag ) {
                        drawArr = _scope.foreUrl;
                    } else {
                        drawArr.push( _scope.foreUrl );
                        _scope.drawImg( {
                            url: _scope.foreUrl.url, 
                            id: _scope.foreUrl.id,
                        } );
                    }
                    // 绘制设计图
                    [].forEach.call( drawArr, function (ele) {
                        _scope.drawImg( {
                            url: ele.url, 
                            id: ele.id,
                        } );
                    } );
                    if ( loaderTotal === loaderEnd ) {
                        if ( typeof _scope.onload === 'function' ) {
                            _scope.onload();
                        }
                    }
                };
            }
        } else {
            _scope.ctx.fillStyle = _scope.canvasColor;
            _scope.ctx.fillRect( 0, 0, _scope.canvasWidth, _scope.canvasHeight );

            // 处理印刷图
            if ( _scope.multiFlag ) {
                drawArr = _scope.foreUrl;
            } else {
                drawArr.push( _scope.foreUrl );
                _scope.drawImg( {
                    url: _scope.foreUrl.url, 
                    id: _scope.foreUrl.id,
                } );
            }
            // 绘制设计图
            [].forEach.call( drawArr, function (ele) {
                _scope.drawImg( {
                    url: ele.url, 
                    id: ele.id,
                } );
            } );
        }
    }
  }
  // 定义原型对象
  Object.assign( composeImgs.prototype, {
    // 清空画布，只保留纹理背景
    clearImg: function () {
        let _scope = this;

        if ( _scope.baseUrl ) {
            _scope.ctx.clearRect( 0, 0, _scope.canvasWidth, _scope.canvasHeight);  
            _scope.ctx.drawImage( _scope.baseImg, 0, 0 );
        } else {
            _scope.ctx.fillStyle = _scope.canvasColor;
            _scope.ctx.fillRect( 0, 0, _scope.canvasWidth, _scope.canvasHeight );
        }
    },

    // 清空指定印刷面
    clearImgById: function ( id ) {
        let _scope = this;
        let index = _scope._getImgObjByID( id ).index;

        if( index !== undefined ) {
            _scope.clearImg();
            _scope.foreImg.splice( index, 1 );
            [].forEach.call( _scope.foreImg, function (ele) {
                _scope._drayImgByIDOrObj( {
                    imgObj: ele
                } );
            } );
        }
    },

    // 导入并绘制印刷图
    drawImg: function ( { 
        url = '', 
        id = '' 
    } ) {
        let _scope = this;
        let img = null;
        let imgObj;

        img = new Image();
        img.src = url;
        
        if( url ) {
            if ( img.complete ) {
                imgObj = {
                    img,
                    id,
                };
                _scope.foreImg.push( imgObj );
                _scope._drayImgByIDOrObj( { imgObj } );
                // 释放图片内存
                img = null;
            } else {
                loaderTotal++;
                img.onload = function(){
                    loaderEnd++;
                    imgObj = {
                        img,
                        id,
                    };
                    _scope.foreImg.push( imgObj );
                    _scope._drayImgByIDOrObj( { imgObj } );
                    if ( loaderTotal === loaderEnd ) {
                        if ( typeof _scope.onload === 'function' ) {
                            _scope.onload();
                        }
                    }
                    // 释放图片内存
                    img = null;
                };
            }
        }
    },

    // 调整印刷图绘制区域
    adjustImg: function ( { 
        width, 
        height, 
        leftSpace, 
        topSpace,
        id, 
    } ) {
        let _scope = this;
        let configure = _scope._getConfigureID( id );

        configure.width = Number(width) || 0;
        configure.height = Number(height) || 0;
        configure.leftSpace = Number(leftSpace) || 0;
        configure.topSpace = Number(topSpace) || 0;
        _scope.clearImg();

        [].forEach.call( _scope.foreImg, function (ele) {
            _scope._drayImgByIDOrObj( {
                imgObj: ele
            } );
        } );
    },

    // 获取合成后的印刷图
    getComposedImg: function () {
        let _scope = this;

        return _scope.canvas.toDataURL( 'img/png' );
    },

    // 通过印刷图id来获取，图片在缓存数组foreImg中的图片对象imgObj
    _getImgObjByID: function ( id ) {
        let _scope = this;
        let imgObj = {};

        for(let i = 0, len = _scope.foreImg.length; i < len; i++) {
            let ele = _scope.foreImg[i];
            if ( Number( id ) === Number( ele.id ) ) {
                imgObj = ele;
                return { obj: imgObj, index: i };
            }
        }
        return imgObj;
    },
    // 通过印刷图id来获取，对应的配置数组foreConfigure对象
    _getConfigureID: function ( id ) {
        let _scope = this;
        let configure = {};

        for(let i = 0, len = _scope.foreConfigure.length; i < len; i++) {
            let ele = _scope.foreConfigure[i];
            if ( Number( id ) === Number( ele.id ) ) {
                configure = ele;
                return configure;
            }
        }
        return configure;
    },

    // 通过印刷图id或者imgObj来绘制印刷图
    _drayImgByIDOrObj: function ( { 
        id, 
        imgObj 
    } ) {
        let _scope = this;
        let configure = {};

        imgObj = imgObj || _scope._getImgObjByID( id ).obj;

        configure = _scope._getConfigureID( imgObj.id );
        configure.width = configure.width || 0;
        configure.height = configure.height || 0;

        if ( imgObj.img ) {
            if( configure.width !== 0 && configure.height !== 0 ) {
                _scope.ctx.drawImage( imgObj.img, configure.leftSpace, configure.topSpace, configure.width, configure.height );
            } else {
                _scope.ctx.drawImage( imgObj.img, configure.leftSpace, configure.topSpace );
            }
        }
    },
  } );
  // 暴露接口
  CreateComposeImgs = composeImgs;
})();