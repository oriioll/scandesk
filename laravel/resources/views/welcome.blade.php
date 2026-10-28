<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="The ScanDesk API welcome page.">
    <title>ScanDesk API</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Figtree:wght@300..900&display=swap" rel="stylesheet">
    <style>
        :root {
            color-scheme: light dark;
            --bg: #fcfcfd;
            --surface: #f0f1f5;
            --text: #1e2128;
            --muted: #555862;
            --primary: #6a4c93;
            --on-primary: #fcfcfd;
            --accent: #2a9d8f;
            --font-heading: "Bricolage Grotesque", system-ui, sans-serif;
            --font-body: "Figtree", system-ui, sans-serif;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg: #131219;
                --surface: #1c1a25;
                --text: #ecebf2;
                --muted: #b8b6c1;
                --primary: #b296ee;
                --on-primary: #17131f;
                --accent: #5ccfc0;
            }
        }

        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        body {
            min-width: 320px;
            min-height: 100vh;
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: var(--font-body);
            font-size: 1rem;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
        }

        .page {
            width: min(100% - 3rem, 1120px);
            min-height: 100vh;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
        }

        header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 2rem 0;
        }

        .brand {
            font-family: var(--font-heading);
            font-size: 1.25rem;
            font-weight: 800;
            letter-spacing: -0.02em;
        }

        main {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 5rem 0 7rem;
        }

        .intro {
            max-width: 660px;
        }

        h1 {
            max-width: 620px;
            margin: 0;
            font-family: var(--font-heading);
            font-size: clamp(2.5rem, 7vw, 4.5rem);
            font-weight: 800;
            letter-spacing: -0.04em;
            line-height: 1.05;
            text-wrap: balance;
        }

        p {
            max-width: 490px;
            margin: 1.5rem 0 2rem;
            color: var(--muted);
            font-size: clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem);
        }

        .frontend-link {
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.7rem 1.1rem;
            border: 1px solid transparent;
            border-radius: 4px;
            background: var(--primary);
            color: var(--on-primary);
            font-weight: 700;
            text-decoration: none;
            transition: background-color 150ms ease;
        }

        .frontend-link:hover {
            background: color-mix(in srgb, var(--primary) 82%, var(--text));
        }

        .frontend-link:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 3px;
        }

        footer {
            padding: 1.5rem 0 2rem;
            border-top: 1px solid color-mix(in srgb, var(--text) 14%, var(--bg));
            color: var(--muted);
            font-size: 0.875rem;
        }

        @media (max-width: 600px) {
            .page {
                width: min(100% - 2rem, 1120px);
            }

            header {
                padding: 1.5rem 0;
            }

            main {
                padding: 3rem 0 5rem;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <header aria-label="ScanDesk">
            <span class="brand">ScanDesk</span>
        </header>

        <main>
            <section class="intro" aria-labelledby="welcome-title">
                <h1 id="welcome-title">Welcome to the ScanDesk API.</h1>
                <p>The backend service for the ScanDesk app, built to support product scanning and inventory management.</p>
                <a class="frontend-link" href="https://app-scandesk.vercel.app">Open ScanDesk</a>
            </section>
        </main>

        <footer>ScanDesk API</footer>
    </div>
</body>
</html>
