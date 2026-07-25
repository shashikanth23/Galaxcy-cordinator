import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { quizApi } from '../../api/client';

export default function QuizzesPage() {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string,number>>({});
  const [result, setResult] = useState<any>(null);
  const [startTime] = useState(Date.now());

  const { data: quizzes, isLoading } = useQuery({ queryKey:['quizzes'], queryFn: ()=>quizApi.list().then(r=>r.data) });
  const { data: quizDetail } = useQuery({
    queryKey: ['quiz', activeQuiz?.id],
    queryFn: () => quizApi.get(activeQuiz.id).then(r=>r.data),
    enabled: !!activeQuiz,
  });
  const submit = useMutation({
    mutationFn: (d:any)=>quizApi.submit(activeQuiz.id,d).then(r=>r.data),
    onSuccess: setResult,
  });

  if (result) return (
    <div className="flex items-center justify-center min-h-full p-4">
      <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="glass-card p-10 text-center max-w-sm w-full">
        <div className="text-6xl mb-4">{result.percentage>=80?'🏆':result.percentage>=60?'⭐':'📚'}</div>
        <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
        <p className="text-6xl font-display font-bold text-gradient-aurora my-6">{result.percentage}%</p>
        <p className="text-white/50 mb-6">You scored <span className="text-white font-bold">{result.score}</span> out of <span className="text-white font-bold">{result.total}</span></p>
        <button onClick={()=>{setActiveQuiz(null);setResult(null);setAnswers({});}} className="btn-primary mx-auto">Try Another Quiz</button>
      </motion.div>
    </div>
  );

  if (quizDetail && activeQuiz) return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">{quizDetail.title}</h1>
        <button onClick={()=>{setActiveQuiz(null);setAnswers({});}} className="btn-ghost text-sm px-3 py-1.5">← Back</button>
      </div>
      <p className="text-white/40 text-sm mb-6">{Object.keys(answers).length} of {quizDetail.questions?.length||0} answered</p>
      <div className="space-y-5">
        {quizDetail.questions?.map((q:any,qi:number)=>(
          <div key={q.id} className="glass-card p-5">
            <p className="font-medium text-white mb-4"><span className="text-aurora font-mono mr-2">{qi+1}.</span>{q.question}</p>
            <div className="space-y-2">
              {q.options?.map((opt:string,oi:number)=>(
                <button key={oi} onClick={()=>setAnswers(a=>({...a,[q.id]:oi}))}
                  className={`w-full px-4 py-3 rounded-xl text-sm text-left border transition-all duration-150 ${answers[q.id]===oi?'bg-aurora/20 border-aurora/50 text-aurora':'bg-stellar/20 border-glassborder text-white/70 hover:border-white/20'}`}>
                  <span className="font-mono text-xs mr-3 opacity-50">{['A','B','C','D'][oi]}</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={()=>submit.mutate({answers,timeTakenSec:Math.floor((Date.now()-startTime)/1000)})}
          disabled={Object.keys(answers).length<(quizDetail.questions?.length||0)||submit.isPending}
          className="btn-primary w-full py-3 justify-center text-base disabled:opacity-40">
          {submit.isPending?'Submitting...':'Submit Answers'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto">
      <h1 className="section-title mb-2">🧪 Space Quizzes</h1>
      <p className="text-white/50 mb-8">Test your astronomy knowledge across the cosmos</p>
      {isLoading ? <div className="grid md:grid-cols-3 gap-4">{Array(3).fill(0).map((_,i)=><div key={i} className="glass-card h-40 animate-pulse"/>)}</div>
      : quizzes?.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz:any,i:number)=>(
            <motion.div key={quiz.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}} whileHover={{scale:1.02}}>
              <div className="glass-card p-6 h-full flex flex-col cursor-pointer hover:border-white/20 transition-all" onClick={()=>setActiveQuiz(quiz)}>
                <div className="text-3xl mb-3">🌌</div>
                <h3 className="font-bold text-white mb-2">{quiz.title}</h3>
                <p className="text-white/40 text-sm flex-1 mb-4 line-clamp-3">{quiz.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`badge ${quiz.difficulty==='BEGINNER'?'badge-quasar':quiz.difficulty==='INTERMEDIATE'?'badge-nova':'badge-pulsar'}`}>{quiz.difficulty}</span>
                  <span className="text-white/30 text-xs">{quiz._count?.questions||0} questions</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card">
          <div className="text-5xl mb-4">🧪</div>
          <p className="text-white/50">No quizzes available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
