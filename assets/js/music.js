const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playbtn = $('.btn-toggle-play')
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const progress_start_time = $('.progress-start-time');
const progress_start_end = $('.progress-start-end');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandomSong: false,
    isRepeat: false,
    songs: [
        {
            name: "Ngủ Một Mình (tình rất tình)",
            singer: "HIEUTHUHAI, Negav, Kewtiie",
            path: URL = "./assets/music/NguMotMinhtinhRatTinh-HIEUTHUHAINegavKewtiie-8397765.mp3",
            image: URL = "./assets/img/ngumotminh_hieuthuhai.jpg"
        },
        {
            name: "Yêu anh đi mẹ anh bán bánh mì",
            singer: "Phúc Du",
            path: URL = "./assets/music/YeuAnhDiMeAnhBanBanhMiCukakRemix-PhucDu-8899910.mp3",
            image: URL = "./assets/img/contraibabanbanhmi_phucdu.jpg"
        },
        {
            name: "See Tình (Speed Up Version)",
            singer: "Hoàng Thùy Linh",
            path: URL = "./assets/music/SeeTinhSpeedupRemix-HoangThuyLinh-7202618.mp3",
            image: URL = "./assets/img/suytinh_hoangthuylinh.jpg"
        },
    ],
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    // render tức là chuyển dữ liệu dạng object hay mảng về html
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        playlist.innerHTML = htmls.join('');
    },

    handlerEvents: function () {
        // Xử lí CD rotate
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10s
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Thao tác để thu nhỏ hình ảnh CD khi lăn chuột xuống
        // Lấy ra thẻ cd và kích thước cd hiện tại
        const cdWidth = cd.offsetWidth;
        // Lắng nghe sự kiện khi ta lăn chuột
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCDWidth = cdWidth - scrollTop;
            // Set lại width cho thằng cd
            // Khi mà chúng ta kéo nhanh quá thì có thể về giá trị âm. Khi giá trị âm thì width không hoạt động tức là không set
            // Vậy thì chúng ta cần phải làm sao ? check bằng toán tử 3 ngôi
            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0;

            // Set độ mờ cho hình CD đó opacity sẽ chạy từ 0 > 1 giá trị càng nhỏ thì càng mờ
            cd.style.opacity = newCDWidth / cdWidth;
        }
        // Xử lý khi click play
        const _this = this;
        playbtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi bài hát được play thì
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi pause bai hat
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }


        // Tiến độ của bài hát + thiết lặp thêm thời gian chạy
        audio.ontimeupdate = function () {
            progress.value = audio.currentTime / audio.duration * 100;
            _this.startTime(audio.currentTime);
            _this.endTime(audio.duration);
        };


        // Xu li khi seek bai hat
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Xu li khi next bai hat
        nextBtn.onclick = function () {
            if (_this.isRandomSong) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();

            // Để cho có hiệu ứng active của ở list bài hát hiển thị màu hồng
            // Thì chúng ta có thể xử lí cách bằng cách render lại tất cả dữ liệu
            // Do danh sách bài hát không quá nhiều thì chúng ta có thể sử dụng cách này
            _this.render();
        }

        // Xu li khi next bai hat
        prevBtn.onclick = function () {
            if (_this.isRandomSong) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();

            // Để cho có hiệu ứng active của ở list bài hát hiển thị màu hồng
            // Thì chúng ta có thể xử lí cách bằng cách render lại tất cả dữ liệu
            // Do danh sách bài hát không quá nhiều thì chúng ta có thể sử dụng cách này
            _this.render();
        }

        // xử lí khi ấn nút repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat; // Điều này nghĩa là nếu ấn vào chưa bật thì sẽ bật, và ấn vào lần nữa thì sẽ tắt
            repeatBtn.classList.toggle('active', _this.isRepeat); // Điều này nghĩa là khi _this.isRepeat === true thì mới thêm active vào class button 
        }
        // Xu li bat tat che do random
        randomBtn.onclick = function () {
            _this.isRandomSong = !_this.isRandomSong; // Điều này nghĩa là nếu ấn vào chưa bật thì sẽ bật, và ấn vào lần nữa thì sẽ tắt
            randomBtn.classList.toggle('active', _this.isRandomSong); // Điều này nghĩa là khi _this.isRandomSong === true thì mới thêm active vào class button 
        }


        // Xử lí khi bài hát kết thúc -> Sẽ tự động next đến bài kế tiếp
        // Ta sẽ gọi function từ next bài từ trên xuống
        audio.onended = function () {
            // Kiểm tra xem nếu có bật chức năng repeat thì ta có reload lại bài hát đó
            if (_this.isRepeat) {
                audio.play();
            } else {
                // Kiểm tra xem nếu không có bật chế độ repeat thì cứ phát bình thường bài hát
                _this.nextSong();
                audio.play();
            }
        }

        // Lắng nghe hành vi click và playlít
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (!e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index); // Do dataset chuyển về dạng String nên chúng ta phải ép kiểu về number
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
            }
        }

    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}'`;
        audio.src = this.currentSong.path;

    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong(); // Sau khi tăng index lên thì phải loadCuurrentSong hiện tại
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong(); // Sau khi tăng index lên thì phải loadCuurrentSong hiện tại
    },
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex === newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    // Chạy time trên progress
    // timeStart
    startTime: function(e) {
        let startMinute = Math.floor(e/60);
        let startSecond = Math.floor(e%60);

        letdisplayStartMinute = startMinute < 10 ? `0 ${startMinute}` : `${startMinute}`;
        letdisplaySstartSecond = startSecond < 10 ? `0 ${startSecond}` : `${startSecond}`;    
        progress_start_time.textContent = `${letdisplayStartMinute} : ${letdisplaySstartSecond}`;
    },
    // timeEnd
    endTime: function(e) {
        let startMinute = Math.floor(e/60);
        let startSecond = Math.floor(e%60);

        letdisplayStartMinute = startMinute < 10 ? `0 ${startMinute}` : `${startMinute}`;
        letdisplaySstartSecond = startSecond < 10 ? `0 ${startSecond}` : `${startSecond}`;    
        progress_start_end.textContent = `${letdisplayStartMinute} : ${letdisplaySstartSecond}`;
    },
    start: function () {
        // Định nghĩa các thuộc tính cho Object;
        this.defineProperties();

        // Lắng nghe sự kiện
        this.handlerEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // render Playlist
        this.render();
    }

}
app.start();