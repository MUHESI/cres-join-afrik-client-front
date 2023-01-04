/* eslint-disable no-console */
import nodemailer from 'nodemailer';
import config from 'config';
// import page from './page.html';

const transport = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	auth: {
		user: config.get('email'),
		pass: config.get('password'),
	},
});

export const sendConfirmationEmail = async (name: string, email: string, confirmationCode: string, idUser: string): Promise<void> => {
	await transport.sendMail({
		from: name,
		to: email,
		subject: 'Welcome to JoinAfrika',
		html: `  <!DOCTYPE html>
        <html lang="en" style="height: 100%">
        <head>
        <meta charset="utf-8">
        <link rel="icon" href="https://res.cloudinary.com/chanel-muhesi/image/upload/v1646826482/cresJoinAfrik/joinAfrikcurrentLogo_yxzklf.png">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#000000">
        <meta name="description" content="JoinAfrik">
        <title>JoinAfrik</title>
        </head>
        <body style="position: relative;color: #312a2a;">
        <div class="contentMain" style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);padding: 10px;max-width: 500px;width: 100%;border: 0.0625rem solid rgba(0, 0, 0, 0.05);">
        <div class="contentHeader" style="text-align: center;">
            <a href="http://" class="link-webSite" style="display: block;">
                <img src="https://res.cloudinary.com/chanel-muhesi/image/upload/v1646826482/cresJoinAfrik/joinAfrikcurrentLogo_yxzklf.png" alt="JoinAfrik" id="logo" style="height: 80px;object-fit: cover;">
            </a>
        </div>


        <div class="contentBody">
            <h2 class="content-mainTitle" style="color: #1b00a8;text-align: center;">
                
             Email de confirmation </h2>
            <div class="contentDescription">                
               Hello ${name}
             
                <p class="content-linkConfirm">
                    Thank you for subscribing. Please confirm your email by clicking on the following link
                    </p><p class="linkConfirm" style="display: flex;justify-content: center;align-items: center;text-align: center;">                       
                        <a href=https://join-africa.herokuapp.com/api/auth/confirm/${idUser}/${confirmationCode} style="text-decoration: none;width: 100px;border: none;color: #fff;text-align: center;background-color: #1b00a8;padding: 5px;font-size: 1.2em;"> click here  </a>
                    </p>
                
                    <div class="content-footer" style="border-top: 2px solid #a39b9b;padding: 15px 0px;justify-content: center;align-items: center;text-align: center;flex-wrap: wrap;">
                        <a href="https://github.com/CRES-DATA/" style="text-decoration: none;">
                            <img src="https://res.cloudinary.com/chanel-muhesi/image/upload/v1646826147/cresJoinAfrik/github_h8zk0k.png" alt="" style="display: inline;margin: 0 0.5em;height: 30px;">
                        </a>
                        <a href="https://twitter.com/cres_science" style="text-decoration: none;">

                            <img src="https://res.cloudinary.com/chanel-muhesi/image/upload/v1646826106/cresJoinAfrik/linkdin_mbobrl.png" alt="" style="display: inline;margin: 0 0.5em;height: 30px;">
                        </a>
                        <a href="https://le-cres.org/" style="text-decoration: none;">
                                <img src="https://res.cloudinary.com/chanel-muhesi/image/upload/v1646826135/cresJoinAfrik/cresPng_qbhpmg.png" alt="" style="display: inline;margin: 0 0.5em;height: 30px;">
                        </a>

                    </div>
            </div>
            <div></div>
        </div>
    </div></body>
    </html>    
          
          
          `,
	}).catch(err => console.log(err));
};

export const sendRecorverEmail_ = async (email: string, idUser: string, verificationCode: string): Promise<void> => {
	await transport.sendMail({
		from: email,
		to: email,
		subject: 'Recorver your password',
		html: `<h1>Create a new password</h1>
          <h2>Hello ${email}</h2>
          <p>You can renew your password with this link below</p>
          <a href=https://join-africa.herokuapp.com/api/auth/recorver/${idUser}/${verificationCode}> Click here</a><br/>
          <img alt="Join Afrika" src="https://res.cloudinary.com/pacyl20/image/upload/v1627857099/logoJ_ue631j.png" height="120"><br />
          <span>Powered By</span>
          <img alt="CRES" src="https://res.cloudinary.com/pacyl20/image/upload/v1627857080/logoC_p8oarr.png" height="59">
          </div>`,
	}).catch(err => console.log(err));
};

export const sendInviteFreelancerEmail = async (name: string, email: string, payload:any ): Promise<void> => {


try {
	
	await transport.sendMail({
		from: name,
		to: email,
		subject: 'JoinAfrika',
		html: `<body style="height: 100%;position: relative;color: #312a2a;">
   
    <div class="contentMain" style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);padding: 0px;max-width: 500px;width: 100%;">
        <div class="contentHeader" style="text-align: center;">
            <a href="http://" class="link-webSite" style="text-decoration: none;">
                <img src="https://res.cloudinary.com/chanel-muhesi/image/upload/v1646826482/cresJoinAfrik/joinAfrikcurrentLogo_yxzklf.png" alt="JoinAfrik" id="logo" style="height: 80px;object-fit: cover;">
                <h4 style="padding: 0px;margin: 0px;font-size: 1.5em;color: #a39b9b;"></h4>
            </a>
        </div>    
        <div class="contentBody">
            <h2 class=".content-greats">Bonjour ${payload.namesFreelancer} </h2>
            <div class="contentDescription" style="margin-left: 20px;font-size: 1.25em;">
               <a href="${payload.linkProfileClient}" class="linkUser-client" style="text-decoration: none;color: #1b00a8;padding: 2px;transition: 0.2s;">  ${payload.namesClient} </a> vous
                a invité à postuler à son job posté le ${payload.dateCreationJob} 
                <h1 class="content-tilte-job" style="text-align: center;font-size: 1em;">
                  ${payload.titleJob}
                </h1>
                <p class="content-seeMore" style="justify-content: center;align-items: center;flex-wrap: wrap;text-align: center;">
                    <a href="${payload.linkAllJobs}" style="text-decoration: none;color: #fff;padding: 4px 5px;margin-left: 5px;font-size: 0.8em;transition: 0.4s;background-color: #1b00a8;border: 1px solid #1b00a8;"> Description du job</a>

                    <a href="${payload.linkAllJobs} " style="text-decoration: none;color: #fff;padding: 4px 5px;margin-left: 5px;font-size: 0.8em;transition: 0.4s;background-color: #1b00a8;border: 1px solid #1b00a8;"> Voir autres offres </a>
                </p>
                <div class="">
                    <div class="content-footer" style="border-top: 2px solid  #a39b9b;padding: 15px 0px;justify-content: center;align-items: center;text-align: center;flex-wrap: wrap;">
                        <a href="https://github.com/CRES-DATA/" style="text-decoration: none;color: #1b00a8;padding: 2px;">
                            <img src="https://res.cloudinary.com/chanel-muhesi/image/upload/v1646826147/cresJoinAfrik/github_h8zk0k.png" alt="" style="display: inline;margin: 0 0.5em;height: 30px;">
                        </a>
                        <a href="https://twitter.com/cres_science" style="text-decoration: none;color: #1b00a8;padding: 2px;">

                            <img src="https://res.cloudinary.com/chanel-muhesi/image/upload/v1646826106/cresJoinAfrik/linkdin_mbobrl.png" alt="" style="display: inline;margin: 0 0.5em;height: 30px;">
                        </a>
                        <a href="https://le-cres.org/" style="text-decoration: none;color: #1b00a8;padding: 2px;">
                                <img src="https://res.cloudinary.com/chanel-muhesi/image/upload/v1646826135/cresJoinAfrik/cresPng_qbhpmg.png" alt="" style="display: inline;margin: 0 0.5em;height: 30px;">
                        </a>

                    </div>
                </div>
            </div>
            <div></div>
        </div>
</div></body>`,
		// html: process(dataOrigin),
		 });
	
} catch (error) {
	console.log('error.message', error.message);	
}

	 };

