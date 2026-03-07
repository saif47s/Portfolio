import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User as SharedUser } from "@shared/schema";

declare global {
    namespace Express {
        interface User extends SharedUser { }
    }
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "portfolio-admin-secret",
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            // In cloud environments like Hugging Face, 'secure: true' might fail if HTTPS is handled by a proxy.
            // Using a more flexible check here.
            secure: process.env.NODE_ENV === "production" && process.env.REQUIRE_SECURE_COOKIES === "true",
            sameSite: "lax",
        },
    };

    app.set("trust proxy", 1);
    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await storage.getUserByUsername(username);
                // Simple password check since there's no hashing right now, or we can use bcrypt.
                // For an admin panel, a hardcoded simple auth is okay if it's securely stored.
                if (!user || user.password !== password) {
                    return done(null, false, { message: "Invalid username or password" });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    app.post("/api/login", passport.authenticate("local"), (req, res) => {
        res.json({ success: true, user: req.user });
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.json({ success: true });
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });
        res.json(req.user);
    });
}

// Helper to protect routes
export function requireAuth(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized. Admin access required." });
}
