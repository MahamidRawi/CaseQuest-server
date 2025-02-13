const express = require('express');
const router = express.Router();
const MailRouter = require('../mail/mail.api');
const WalletRouter = require('../wallet/wallet.api');
const { validate } = require('../../middleware/auth/auth.middleware');
const { createCase, getCases, getUser, getUsers } = require('../../actions/main/fetch.actions');
const CasesRouter = require('../cases/cases.api');
router.use('/mail', MailRouter);
router.use('/cases', CasesRouter);
router.use('/wallet', WalletRouter)

router.get('/fetchHomePage', validate, async (req, res) => {
    try {
        const userInfo = await getUser(req.userId);
        const userCases = await getCases(userInfo.info.cases);
        const data = { userInfo, userCases };
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred' });
    }
});

router.post('/createCase', async (req, res) => {
    createCase();
});

router.get('/getMyCases', validate, async (req, res) => {
    const cases = getCases();
    return res.status(cases.success == true ? 200 : 500).json({cases, success: cases ? true : false});
});

router.get('/getLawyers', validate, async (req, res) => {
    try {
        const {users, success} = await getUsers();
        return res.status(success ? 200 : 500).json({users, success});
    } catch (err) {
        return res.status(500).json({success: false, message: 'An Error has Occured'});
    }
});

router.get('/getUserInfo', validate, async (req, res) => {
    try {
        const resp = await getUser(req.userId);
        return res.status(resp.stc || 200).json(resp);
    } catch (err) {
        return res.status(500)
    }
})

router.get('/getLawyer', validate, async (req, res) => {
    const targetId = req.headers['targetid'];
    try {
        const resp = await getUser(targetId, 'balance');
        return res.status(resp.stc || 200).json(resp);
    } catch (err) {
        return res.status(500);
    }
});
module.exports = router;