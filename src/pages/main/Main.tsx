import './Main.css';

import {type MouseEvent, type RefObject, useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {type GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import cupModel from './images/cup.min.glb';
import fazeLogo from './images/faze.png';
import manImage from './images/man.png';
import naviLogo from './images/navi.png';
import neonLogo from './images/neon-logo.png';
import phoenixImage from './images/phoenix.png';
import spectreImage from './images/spectre.png';

type GameType = 'dota' | 'cs2' | 'valorant' | 'league';
type MatchStatus = 'finished' | 'live' | 'upcoming' | 'later';

type Match = {
    time: string;
    game: GameType;
    gameLabel: string;
    teams: string;
    status: MatchStatus;
    statusLabel: string;
};

type NewsItem = {
    tag: GameType;
    tagLabel: string;
    date: string;
    title: string;
    excerpt: string;
};

type LeaderboardRow = {
    rank: number;
    team: string;
    points: number;
    game: GameType;
    gameLabel: string;
};

const MATCHES: Match[] = [
    {
        time: '17:45',
        game: 'dota',
        gameLabel: 'Dota 2',
        teams: 'Shadow Legion vs Team Phantom',
        status: 'finished',
        statusLabel: 'Смотреть запись',
    },
    {
        time: '19:30',
        game: 'cs2',
        gameLabel: 'CS2',
        teams: 'NAVI vs FaZe Clan',
        status: 'live',
        statusLabel: 'Смотреть трансляцию',
    },
    {
        time: '21:00',
        game: 'dota',
        gameLabel: 'Dota 2',
        teams: 'Shadow Legion vs Nebula Five',
        status: 'upcoming',
        statusLabel: 'Будет трансляция',
    },
    {
        time: '22:45',
        game: 'valorant',
        gameLabel: 'Valorant',
        teams: 'Nova Squad vs Iron Wolves',
        status: 'upcoming',
        statusLabel: 'Будет трансляция',
    },
    {
        time: '00:30',
        game: 'cs2',
        gameLabel: 'CS2',
        teams: 'Crimson Tide vs Bobr Gaming',
        status: 'finished',
        statusLabel: 'Смотреть запись',
    },
];

const NEWS: NewsItem[] = [
    {
        tag: 'cs2',
        tagLabel: 'CS2',
        date: '08.07.2026',
        title: 'Гранд-финал зимнего кубка пройдет на новой арене',
        excerpt: 'Организаторы объявили дату и место финального матча сезона.',
    },
    {
        tag: 'dota',
        tagLabel: 'Dota 2',
        date: '07.07.2026',
        title: 'Новая команда ворвалась в топ-5 мирового рейтинга',
        excerpt: 'Молодой состав удивил всех на региональном отборе.',
    },
    {
        tag: 'valorant',
        tagLabel: 'Valorant',
        date: '06.07.2026',
        title: 'Призовой фонд летней лиги увеличен вдвое',
        excerpt: 'Организаторы объявили о рекордном бюджете турнира.',
    },
    {
        tag: 'league',
        tagLabel: 'League',
        date: '05.07.2026',
        title: 'Открыт набор в академию для начинающих игроков',
        excerpt: 'Бесплатное обучение от действующих профессионалов.',
    },
];

const LEADERBOARD: LeaderboardRow[] = [
    {rank: 1, team: 'Shadow Legion', points: 18, game: 'dota', gameLabel: 'Dota 2'},
    {rank: 2, team: 'Team Phantom', points: 15, game: 'dota', gameLabel: 'Dota 2'},
    {rank: 3, team: 'NAVI', points: 12, game: 'cs2', gameLabel: 'CS2'},
    {rank: 4, team: 'Bobr Gaming', points: 9, game: 'cs2', gameLabel: 'CS2'},
    {rank: 5, team: 'Iron Wolves', points: 0, game: 'valorant', gameLabel: 'Valorant'},
    {rank: 6, team: 'FaZe Clan', points: 0, game: 'cs2', gameLabel: 'CS2'},
    {rank: 7, team: 'Nova Squad', points: 0, game: 'valorant', gameLabel: 'Valorant'},
    {rank: 8, team: 'Crimson Tide', points: 0, game: 'cs2', gameLabel: 'CS2'},
];

const gameOptions: Array<{value: 'all' | GameType; label: string}> = [
    {value: 'all', label: 'Все игры'},
    {value: 'cs2', label: 'CS2'},
    {value: 'dota', label: 'Dota 2'},
    {value: 'valorant', label: 'Valorant'},
    {value: 'league', label: 'League'},
];

const gameTagClass = (game: GameType) => `game-tag game-tag--${game}`;

export const MainPage = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [gameFilter, setGameFilter] = useState<'all' | GameType>('all');

    const proveSectionRef = useRef<HTMLElement | null>(null);
    const transSectionRef = useRef<HTMLElement | null>(null);
    const scheduleSectionRef = useRef<HTMLElement | null>(null);
    const newsSectionRef = useRef<HTMLElement | null>(null);
    const teamsSectionRef = useRef<HTMLElement | null>(null);
    const trophyHostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const updateDate = () => {
            const formatted = new Intl.DateTimeFormat('ru-RU', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(new Date());

            setCurrentDate(formatted.charAt(0).toUpperCase() + formatted.slice(1));
        };

        updateDate();
        const timer = window.setInterval(updateDate, 60000);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const revealEls = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal--in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {threshold: 0.12},
        );

        revealEls.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const host = trophyHostRef.current;

        if (!host) {
            return;
        }

        let mounted = true;
        let frameId = 0;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
        const pivot = new THREE.Group();

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        host.appendChild(renderer.domElement);
        scene.add(pivot);

        const ambient = new THREE.AmbientLight(0xffffff, 0.58);
        scene.add(ambient);

        const cyanLight = new THREE.PointLight(0x29d8f0, 7.5, 10);
        cyanLight.position.set(-2.3, 1.3, 2.5);
        scene.add(cyanLight);

        const magentaLight = new THREE.PointLight(0xd84bf5, 7, 10);
        magentaLight.position.set(2.1, -0.9, 2.2);
        scene.add(magentaLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
        keyLight.position.set(1.6, 2.5, 3);
        scene.add(keyLight);

        const fitCameraToObject = (object: THREE.Object3D, offset = 1.30) => {
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxSize = Math.max(size.x, size.y, size.z);

            if (maxSize === 0) {
                return;
            }

            const fov = camera.fov * (Math.PI / 180);
            const fitHeightDistance = maxSize / (2 * Math.tan(fov / 2));
            const fitWidthDistance = fitHeightDistance / camera.aspect;
            const distance = offset * Math.max(fitHeightDistance, fitWidthDistance);

            camera.position.copy(center).add(new THREE.Vector3(0, 0.02 * maxSize, distance));
            camera.near = distance / 100;
            camera.far = distance * 100;
            camera.lookAt(center);
            camera.updateProjectionMatrix();
        };

        const resizeRenderer = () => {
            const width = host.clientWidth || 420;
            const height = host.clientHeight || 520;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);

            if (pivot.children.length > 0) {
                fitCameraToObject(pivot);
            }
        };

        const centerModel = (model: THREE.Object3D) => {
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());

            model.position.sub(center);
            pivot.add(model);
            fitCameraToObject(pivot);
        };

        const disposeObject = (object: THREE.Object3D) => {
            object.traverse((child: THREE.Object3D) => {
                const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;

                if (!mesh.isMesh) {
                    return;
                }

                mesh.geometry?.dispose();

                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((material: THREE.Material) => material.dispose());
                } else {
                    mesh.material?.dispose();
                }
            });
        };

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        resizeRenderer();

        loader.load(
            cupModel,
            (gltf: GLTF) => {
                if (!mounted) {
                    disposeObject(gltf.scene);
                    return;
                }

                centerModel(gltf.scene);
            },
            undefined,
            () => {
                if (!mounted) {
                    return;
                }

                const fallback = new THREE.Mesh(
                    new THREE.OctahedronGeometry(1.2, 2),
                    new THREE.MeshStandardMaterial({
                        color: 0x29d8f0,
                        emissive: 0x7c3aed,
                        emissiveIntensity: 0.35,
                        metalness: 0.55,
                        roughness: 0.22,
                    }),
                );

                centerModel(fallback);
            },
        );

        const animate = () => {
            frameId = window.requestAnimationFrame(animate);
            pivot.rotation.y += 0.008;
            pivot.rotation.x = Math.sin(performance.now() * 0.001) * 0.035;
            renderer.render(scene, camera);
        };

        animate();
        window.addEventListener('resize', resizeRenderer);

        return () => {
            mounted = false;
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resizeRenderer);
            disposeObject(pivot);
            renderer.dispose();
            dracoLoader.dispose();

            if (renderer.domElement.parentNode === host) {
                host.removeChild(renderer.domElement);
            }
        };
    }, []);

    const scrollToRef = (ref: RefObject<HTMLElement | null>) => {
        ref.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    const handleNavClick = (ref: RefObject<HTMLElement | null>) => (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        scrollToRef(ref);
        setMenuOpen(false);
    };

    const filteredLeaderboard = LEADERBOARD.filter((row) => {
        const matchesSearch = row.team.toLowerCase().includes(searchTerm.trim().toLowerCase());
        const matchesGame = gameFilter === 'all' || row.game === gameFilter;

        return matchesSearch && matchesGame;
    });

    return (
        <div className="cyberarena">
            <nav className="top-nav reveal">
                <div className="nav-logo">
                    <img src={neonLogo} alt="" className="nav-logo-mark" aria-hidden="true" />
                    <span className="nav-logo-cyber">CYBER</span>
                    <span className="nav-logo-arena">ARENA</span>
                </div>

                <div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
                    <a href="#streams" onClick={handleNavClick(transSectionRef)}>
                        Трансляции <span className="nav-live-dot"></span>
                    </a>
                    <a href="#schedule" onClick={handleNavClick(scheduleSectionRef)}>
                        Расписание
                    </a>
                    <a href="#news" onClick={handleNavClick(newsSectionRef)}>
                        Новости
                    </a>
                    <a href="#teams" onClick={handleNavClick(teamsSectionRef)}>
                        Команды
                    </a>
                </div>

                <div className="nav-right">
                    <button type="button" className="login-button">
                        Войти
                    </button>
                    <span className="nav-date">{currentDate}</span>
                    <button
                        type="button"
                        className={`burger ${menuOpen ? 'burger--active' : ''}`}
                        aria-label="Меню"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            <header className="hero-section">
                <div className="hero-bg-text" aria-hidden="true">
                    <span>CYBER</span>
                    <span>ARENA</span>
                </div>

                <div className="hero-content reveal">
                    <div className="hero-copy">
                        <h1 className="hero-title">
                            CYBER<span>ARENA</span>
                        </h1>
                        <div className="hero-badge">Центр вселенной киберспорта</div>
                        <button
                            type="button"
                            className="scroll-dot"
                            aria-label="Перейти ниже"
                            onClick={() => scrollToRef(proveSectionRef)}
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                    </div>
                    <div className="trophy-wrap" ref={trophyHostRef} aria-hidden="true"></div>
                </div>
            </header>

            <section className="cta-section" ref={proveSectionRef}>
                <div className="character-wrap reveal">
                    <img src={spectreImage} alt="" className="demon-figure" aria-hidden="true" />
                </div>
                <div className="cta-text reveal">
                    <div className="badge-pill badge-pill--right">
                        <span className="pulse"></span> Сезон 2026 уже открыт
                    </div>
                    <h2 className="section-heading">
                        Докажи, что ты <span className="grad">лучший</span> в игре
                    </h2>
                    <p>
                        Присоединяйся к крупнейшей киберспортивной арене. Турниры, команды и призовые фонды - все в
                        одном месте.
                    </p>
                    <div className="cta-buttons">
                        <button type="button" className="primary-button">
                            Зарегистрироваться на турнир
                        </button>
                        <button type="button" className="secondary-button" onClick={() => scrollToRef(scheduleSectionRef)}>
                            Смотреть расписание
                        </button>
                    </div>
                </div>
            </section>

            <section className="live-section" ref={transSectionRef}>
                <div className="section-inner">
                    <div className="live-header reveal">
                        <div className="badge-pill badge-pill--center">
                            <span className="pulse"></span> Прямой эфир
                        </div>
                        <h2 className="section-heading section-heading--center">
                            Следи за <span className="grad">главными</span>
                            <br />
                            битвами
                        </h2>
                    </div>

                    <div className="live-visual reveal">
                        <img src={manImage} alt="" className="live-art live-art--fighter" aria-hidden="true" />
                        <div className="live-card">
                            <div className="live-status">
                                <span></span>
                                <b>LIVE</b> - PGL Major Copenhagen 2026
                            </div>
                            <div className="live-teams">
                                <div className="live-team">
                                    <img src={naviLogo} alt="NAVI" className="team-logo" />
                                    <span>NAVI</span>
                                </div>
                                <div className="live-score">
                                    <div>2 : 1</div>
                                    <span>Карта 4 - Ancient</span>
                                </div>
                                <div className="live-team">
                                    <img src={fazeLogo} alt="FaZe Clan" className="team-logo" />
                                    <span>FaZe Clan</span>
                                </div>
                            </div>
                            <div className="live-buttons">
                                <button type="button" className="primary-button">
                                    Смотреть трансляцию
                                </button>
                                <button type="button" className="secondary-button" onClick={() => scrollToRef(scheduleSectionRef)}>
                                    Расписание матчей
                                </button>
                            </div>
                        </div>
                        <img src={phoenixImage} alt="" className="live-art live-art--phoenix" aria-hidden="true" />
                    </div>
                </div>
            </section>

            <section className="schedule-section" ref={scheduleSectionRef}>
                <div className="section-inner">
                    <div className="section-label-wrap">
                        <div className="badge-pill reveal">Расписание</div>
                    </div>
                    <h2 className="section-heading reveal">Расписание сегодняшних матчей</h2>

                    <div className="schedule-table reveal">
                        {MATCHES.map((match) => (
                            <div className="schedule-row" key={`${match.time}-${match.teams}`}>
                                <div className="schedule-time">{match.time}</div>
                                <div className={gameTagClass(match.game)}>{match.gameLabel}</div>
                                <div className="schedule-match">{match.teams}</div>
                                <div className={`schedule-status schedule-status--${match.status}`}>{match.statusLabel}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="news-section" ref={newsSectionRef}>
                <div className="section-inner">
                    <div className="section-label-wrap">
                        <div className="badge-pill reveal">Новости</div>
                    </div>
                    <div className="news-top reveal">
                        <h2 className="section-heading section-heading--flush">Свежие новости</h2>
                        <a href="#all-news">Все новости -&gt;</a>
                    </div>

                    <div className="news-grid reveal">
                        {NEWS.map((item) => (
                            <article className="news-card" key={item.title}>
                                <div className="news-card-top">
                                    <span className={gameTagClass(item.tag)}>{item.tagLabel}</span>
                                    <span>{item.date}</span>
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.excerpt}</p>
                                <a href="#read-more">Читать полностью -&gt;</a>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="leaderboard-section" ref={teamsSectionRef}>
                <div className="section-inner">
                    <div className="section-label-wrap">
                        <div className="badge-pill reveal">Турнирная таблица</div>
                    </div>
                    <h2 className="section-heading reveal">Турнирная таблица</h2>

                    <div className="leaderboard-controls reveal">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Поиск команды..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                        <select
                            className="game-select"
                            value={gameFilter}
                            onChange={(event) => setGameFilter(event.target.value as 'all' | GameType)}
                        >
                            {gameOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button type="button" className="primary-button leaderboard-find">
                            Найти
                        </button>
                    </div>

                    <div className="leaderboard-table reveal">
                        {filteredLeaderboard.length > 0 ? (
                            filteredLeaderboard.map((row) => (
                                <div className="leaderboard-row" key={`${row.rank}-${row.team}`}>
                                    <div className="rank-num">{row.rank}</div>
                                    <div className={gameTagClass(row.game)}>{row.gameLabel}</div>
                                    <div className="team-name">{row.team}</div>
                                    <div className="team-points">{row.points} очков</div>
                                </div>
                            ))
                        ) : (
                            <div className="leaderboard-row leaderboard-row--empty">Команды не найдены</div>
                        )}
                    </div>
                </div>
            </section>

            <div className="section-inner">
                <div className="back-to-top-wrap reveal">
                    <button
                        type="button"
                        className="back-to-top"
                        aria-label="Наверх"
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    </button>
                </div>
            </div>

            <footer className="page-footer">
                <div className="section-inner footer-inner">
                    <span>© 2026 CyberArena</span>
                    <div className="footer-links">
                        <a href="#rules">Правила</a>
                        <a href="#contacts">Контакты</a>
                        <a href="#support">Поддержка</a>
                    </div>
                    <div className="footer-socials" aria-label="Социальные ссылки">
                        <a href="#rules" aria-label="Правила">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="8" />
                                <path d="M12 8v5l3 2" />
                            </svg>
                        </a>
                        <a href="#contacts" aria-label="Контакты">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M21 4 3 11l7 3 3 7 8-17Z" />
                                <path d="m10 14 11-10" />
                            </svg>
                        </a>
                        <a href="#support" aria-label="Поддержка">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M6 3h4l2 5-3 2c1.4 2.8 3.2 4.6 6 6l2-3 5 2v4c0 1.1-.9 2-2 2C10.6 21 3 13.4 3 4c0-1.1.9-1 3-1Z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
