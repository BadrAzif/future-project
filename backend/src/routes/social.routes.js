import e from "express";
import {applelogin, facebooklogin, githublogin, googlelogin} from '../controllers/social.controller.js';

const router = e.Router();  

router.post('/google', googlelogin);
router.post('/facebook', facebooklogin);
router.post('/github', githublogin);
router.post('/apple', applelogin);

export default router;