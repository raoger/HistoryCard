--1ST QUERY TO RUN WHEN SHOWING A SUBJECT TEACHER.
SELECT "SUBJECT_CODE","Batch","DEPARTMENT","SECTION"
FROM "TEACH_SUBJECT"
WHERE "FACULTY_ID"=$1;